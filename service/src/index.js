const {initServer} = require('./server');
const config = require('config');
const packageInfo = require('../package.json');

async function startService() {
  const serverConfig = config.get('server');

  await initServer(Object.assign({name: packageInfo.name}, serverConfig));
}

// Don't autostart in test mode.
if(process.env['NODE_ENV'] !== 'test') {
  startService();
}

module.exports = {
  startService
};
