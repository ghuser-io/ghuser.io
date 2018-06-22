module.exports = {
    $plugins: [
        require('@reframe/react-kit')
    ]
};

module.exports['serverStartFile'] = require.resolve('./server/start.js');
