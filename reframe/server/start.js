const Hapi = require('hapi');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');

module.exports = start();

async function start() {
    const server = Hapi.Server({
        port: process.env.PORT || 3000,
        debug: {request: ['internal']},
    });

    server.route({
      method: 'GET',
      path: '/api/v0/u/{name}',
      handler: request => ({
        username: request.params.name,
        avatar: 'https://avatars2.githubusercontent.com/u/11795312'
      })
    });

    // Run `$ reframe eject hapi` to eject the integration plugin.
    await server.register(config.hapiIntegrationPlugin);

    await server.start();

    const env = colorEmphasis(process.env.NODE_ENV||'development');
    console.log(symbolSuccess+'Server running (for '+env+')');

    return server;
}
