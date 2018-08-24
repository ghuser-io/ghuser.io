const Bell = require('bell');
const Hapi = require('hapi');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');

module.exports = start();

async function start() {
  const server = Hapi.Server({
    port: process.env.PORT || 3000,
    debug: {request: ['internal']},
  });

  // Run `$ reframe eject hapi` to eject the integration plugin.
  await server.register(config.hapiIntegrationPlugin);

  const githubClientId = process.env.GITHUB_CLIENT_ID || 'GITHUB_CLIENT_ID';
  /*TODO server.auth.strategy('twitter', 'bell', { // See https://github.com/hapijs/bell
    provider: 'twitter',
    password: 'cookie_encryption_password_secure',
    clientId: 'my_twitter_client_id',
    clientSecret: 'my_twitter_client_secret',
    isSecure: true
  });*/
  server.route({
    method: 'GET',
    path: '/login',
    handler() {
      return githubClientId; //TEMP for test passing env vars from Up
    }
  });

  await server.start();

  const env = colorEmphasis(process.env.NODE_ENV||'development');
  console.log(symbolSuccess+'Server running (for '+env+')');

  return server;
}
