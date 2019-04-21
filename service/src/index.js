const {initServer} = require('./server');
const config = require('config');
const ProviderManager = require('./providerManager.js');
const packageInfo = require('../package.json');

async function startService() {
  // Load the required configurations
  const serverConfig = config.get('server');
  const providerConfig = config.get('providers');
  const providerOrder = config.get('providerOrder');
  const failoverOptions = config.get('providerFailoverOptions');

  // Initialise a ProviderManager for use by this server.
  const pm = new ProviderManager(providerConfig, providerOrder, failoverOptions);


  await initServer(Object.assign({name: packageInfo.name, app: {pm}}, serverConfig));
}

// Don't autostart in test mode.
if(process.env['NODE_ENV'] !== 'test') {
  startService();
}

module.exports = {
  startService
};
