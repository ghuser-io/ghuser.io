module.exports = {
    $plugins: [
        require('@reframe/react-kit')
    ]
};

module.exports['browserEntryFile'] = require.resolve('./browser/browserEntry.js');

module.exports['serverStartFile'] = require.resolve('./server/start.js');
