const Hapi = require('hapi');
const bunyan = require('bunyan');
const good = require('good');

const {setupRoutes} = require('./routes');

/**
 * @typedef {Object} HapiServer
 * @desc A Hapi Server instance. See the Hapi documentation for more information: https://hapijs.com/api#server
 */

/**
 * Initialise a Hapi server.
 * @param {Object} serverOptions - Options for the configuration of a new HTTP server.
 * @param {string} serverOptions.host - The hostname the server should be started on.
 * @param {string} serverOptions.port - The port the server should be started on.
 * @param {string} serverOptions.name - A name to uniquely identify this server (used for logging).
 * @param {string} serverOptions.logLevel - The minimum level of log messages to log. One of 'debug', 'info', 'warn',
 *    'error', 'fatal'.
 * @param {string} serverOptions.corsOrigins - A set of accepted origins for CORS. This should be ["*"] in development
 * to cope with the Chrome CORS bug (https://bugs.chromium.org/p/chromium/issues/detail?id=67743) but MUST be
 * configured securely for production.
 * @param {string} serverOptions.app - Global application components available at any time through server.app.
 * @returns {HapiServer}
 */
async function initServer({host, port, name, logLevel, corsOrigins, app}) {
  // Setup a logger for this server and its activity.
  const serverLogger = bunyan.createLogger({name, level: logLevel});

  try {
    const server = Hapi.Server({
      port,
      host,
      routes: {
        cors: {
          origin: corsOrigins
        }
      }
    });

    // Setup all the required routes for this server.
    setupRoutes(server);

    // Setup the required plugins for this server.
    await server.register({
      plugin: good,
      options: {
        reporters: {
          bunyan: [{
            module: 'good-bunyan',
            args: [
              { response: '*', log: '*', error: '*', request: '*' },
              {
                logger: serverLogger,
                levels: {
                  request: 'info',
                  response: 'info',
                  error: 'error'
                }
              }
            ]
          }]
        }
      }
    });

    // Add any global app components to server.app
    server.app = Object.assign({}, server.app, app);

    // Start the server.
    await server.start();
    serverLogger.info(`Server running on ${server.info.uri}`);
    return server;
  } catch(err) {
    // Log a useful error and rethrow
    serverLogger.error(err, `Server failed to start due to an error: ${err.message}`);
    throw err;
  }
}

module.exports = {
  initServer
};