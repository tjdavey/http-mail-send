const packageInfo = require('../../package.json');

/**
 * Handler for the root route. Displays some information about the service
 * @param {Object} request - A Hapi.js request object.
 * @param {Object} h - A Hapi.js response toolkit object.
 * @return {Object} A Hapi.js response object.
 */
async function rootHandler(request, h) {

  const response = h.response({
    service: packageInfo.name,
    version: packageInfo.version
  });
  response.type('application/json');
  response.code(200);
  return response;
}

module.exports = {
  rootHandler
};