const AWS = require('aws-sdk');
const Bell = require('bell');
const fetch = require('fetch-retry');
const h2o2 = require('h2o2');
const Hapi = require('hapi');
const Raven = require('raven');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');

const db = require('../db');
const urls = require('../ghuser').urls;

module.exports = start();

async function start() {
  const server = Hapi.Server({
    port: process.env.PORT || 3000,
    debug: {request: ['internal']},
  });

  // Run `$ reframe eject server-integration` to eject the integration plugin.
  await server.register(config.hapiIntegrationPlugin);

  await server.register(Bell); // see https://github.com/hapijs/bell
  const password = process.env.COOKIE_ENCRYPTION_PASSWORD || 'COOKIE_ENCRYPTION_PASSWORD_MIN_32_CHARS';
  const clientId = process.env.GITHUB_CLIENT_ID || 'GITHUB_CLIENT_ID';
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || 'GITHUB_CLIENT_SECRET';
  server.auth.strategy('github', 'bell', {
    provider: 'github',
    password,
    clientId,
    clientSecret,
    location: urls.landing,
    scope: []
  });

  await server.register({ plugin: h2o2 }); // see https://github.com/hapijs/h2o2

  const awsSqsQueueUrl = process.env.AWS_SQS_QUEUE_URL || 'AWS_SQS_QUEUE_URL';
  AWS.config.update({region: 'us-east-1'});
  const sqs = new AWS.SQS;
  const sendSqsMsg = async body => {
    return new Promise((resolve, reject) => {
      sqs.sendMessage({
        QueueUrl: awsSqsQueueUrl,
        MessageGroupId: '0',
        MessageBody: body
      }, (err, _) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  };
  const getAllSqsMsgs = async () => {
    return new Promise((resolve, reject) => {
      sqs.receiveMessage({
        QueueUrl: awsSqsQueueUrl,
        MaxNumberOfMessages: 10
      }, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        if (!data.Messages) { // empty queue
          resolve([]);
          return;
        }
        resolve(data.Messages.map(msg => {
          const fields = msg.Body.split(',');
          return {
            login: fields[0],
            avatar_url: fields[1]
          };
        }));
      });
    });
  };

  if (process.env.SENTRY_DNS) {
    Raven.config(process.env.SENTRY_DNS).install();
  }
  const raven = {
    async captureException(e) {
      return new Promise((resolve, _) => {
        if (process.env.SENTRY_DNS) {
          Raven.captureException(e, resolve);
        } else {
          resolve();
        }
      });
    },
    async captureMessage(msg) {
      return new Promise((resolve, _) => {
        if (process.env.SENTRY_DNS) {
          Raven.captureMessage(msg, resolve);
        } else {
          resolve();
        }
      });
    }
  };

  server.route({
    method: ['GET', 'POST'],
    path: urls.oauthEndpoint,
    options: {
      auth: 'github',
      handler: async function (request, h) {
        if (!request.auth.isAuthenticated) {
          await raven.captureException(new Error(request.auth.error.message));
          return `Authentication failed due to: ${request.auth.error.message}`;
        }

        let login;
        try {
          login = request.auth.credentials.profile.raw.login;
          try {
            await (await fetch(`${db.url}/users/${login.toLowerCase()}.json`)).json();
            // if we reach this point, then this profile exists or is already being created, so we
            // skip the SQS queue:
            return h.redirect(`/${login}`);
          } catch(e) {}
          // temporarily disabled for issue143: await raven.captureMessage(`Profile request: ${login}`);
          const avatar_url = request.auth.credentials.profile.raw.avatar_url;
          await sendSqsMsg(`${login},${avatar_url}`);
        } catch (e) {
          console.error(e);
          await raven.captureException(new Error(e));
        }
        return h.redirect(`/${login}/creating`);
      }
    }
  });

  server.route({
    method: ['GET'],
    path: urls.profileQueueEndpoint,
    handler: async function (request, h) {
      let profileQueue = [];
      try {
        profileQueue = await getAllSqsMsgs();
      } catch (e) {
        console.error(e);
        await raven.captureException(new Error(e));
      }
      return profileQueue;
    }
  });

  server.route({
    method: 'GET',
    path: `${urls.dataEndpoint}/{bar}`,
    handler: {
      proxy: {
        uri: 'http://localhost:8080/{bar}'
      }
    }
  });

  await server.start();

  const env = colorEmphasis(process.env.NODE_ENV||'development');
  console.log(symbolSuccess+'Server running (for '+env+')');

  return server;
}
