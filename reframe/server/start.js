const Hapi = require('hapi');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');

module.exports = start();

async function start() {
    const server = Hapi.Server({
        port: process.env.PORT,
        debug: {request: ['internal']},
    });

    // Run `$ reframe eject hapi` to eject the integration plugin.
    await server.register(config.hapiIntegrationPlugin);

    await server.start();

    const env = colorEmphasis(process.env.NODE_ENV||'development');
    console.log(symbolSuccess+'Server running (for '+env+')');

    return server;
}
