const Joi = require('joi');

/**
 * Handler for the send route. Sends an email according to the required parameters.
 * @param {Object} request - A Hapi.js request object.
 * @param {Object} h - A Hapi.js response toolkit object.
 * @return {Object} A Hapi.js response object.
 */
async function sendHandler(request, h) {
  try {
    const sendResult = await request.server.app.pm.send(request.payload, {log: request.log.bind(request)});

    // Log the success and send a successful response to the client.
    request.log(['info'], `Sent successfully via ${sendResult.provider}`);

    const response = h.response(Object.assign({success: true}, sendResult));
    response.type('application/json');
    response.code(200);
    return response;
  } catch(err) {
    // Record a detailed error in the logs and send an Internal Server Error to the client.
    request.log(['error'], err);

    const response = h.response({
      success: false,
      error: err.message
    });
    response.type('application/json');
    response.code(500);
    return response;
  }
}

/**
 * Joi payload validation schema for the send endpoint.
 * @type {{to, subject, body}}
 */
const sendPayloadSchema = {
  to: Joi.string().email().max(256).required(), // IETF RFC 3696 Errata 1003
  subject: Joi.string().max(998).required(), // IETF RFC 2822 Section 2.1.1
  body: Joi.string().required()
};

module.exports = {
  sendHandler,
  sendPayloadSchema
};