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

  await server.register(Bell); // see https://github.com/hapijs/bell
  const password = process.env.COOKIE_ENCRYPTION_PASSWORD || 'COOKIE_ENCRYPTION_PASSWORD_MIN_32_CHARS';
  const clientId = process.env.GITHUB_CLIENT_ID || 'GITHUB_CLIENT_ID';
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || 'GITHUB_CLIENT_SECRET';
  server.auth.strategy('github', 'bell', {
    provider: 'github',
    password,
    clientId,
    clientSecret,
    scope: []
  });
  server.route({
    method: ['GET', 'POST'],
    path: '/login',
    options: {
      auth: 'github',
      handler: function (request, h) {
        if (!request.auth.isAuthenticated) {
          return `Authentication failed due to: ${request.auth.error.message}`;
        }
        return h.redirect('/AurelienLourot');
      }
    }
  });

  await server.start();

  const env = colorEmphasis(process.env.NODE_ENV||'development');
  console.log(symbolSuccess+'Server running (for '+env+')');

  return server;
}
