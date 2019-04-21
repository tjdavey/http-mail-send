const {rootHandler} = require('./root');
const {sendHandler, sendPayloadSchema} = require('./send');

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
    handler: rootHandler
  });

  // Route for sending emails
  server.route({
    method: 'POST',
    path: '/send',
    handler: sendHandler,
    config: {
      validate: {
        payload: sendPayloadSchema
      }
    }
  });
}

module.exports = {setupRoutes};