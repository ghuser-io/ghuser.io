module.exports = {
    $plugins: [
        require('@reframe/react-kit')
    ]
};

module.exports['browserEntryFile'] = require.resolve('./browser/browserEntry.js');
