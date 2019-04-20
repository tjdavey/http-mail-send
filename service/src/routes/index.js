const packageInfo = require('../../package.json');

/**
 * Sets up all the required routes for this service.
 *
 * @param {HapiServer} server
 */
function setupRoutes(server) {

  // Root route for identifying the service
  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return {
        service: packageInfo.name,
        version: packageInfo.version
      };
    }
  });
}

module.exports = {setupRoutes};