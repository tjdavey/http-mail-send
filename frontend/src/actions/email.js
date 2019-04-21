import fetch from 'cross-fetch';

export const EMAIL_SEND_START = 'EMAIL_SEND_START';
export const EMAIL_SEND_SUCCESS = 'EMAIL_SEND_SUCCESS';
export const EMAIL_SEND_FAILURE = 'EMAIL_SEND_FAILURE';

/**
 *
 * @param {String} to - A single email recipient
 * @param {String} subject - An email subject
 * @param {String} body - A HTML email body
 */
export function sendEmail(to, subject, body) {
  return (dispatch) => {
    dispatch(sendEmailStart());

    // Fetch the
    fetch(process.env.REACT_APP_SEND_EMAIL_ENDPOINT, {
      method: 'POST',
      headers: {'Content-type': 'application-json; charset=UTF-8'},
      body: JSON.stringify({to, subject, body})})
    .then((result) => {
      dispatch(sendEmailSuccess(result));
    })
    .catch((err) => {
      dispatch(sendEmailFailure(err));
    })
  }
}

/**
 * Action creator which should be dispatched when an email send started
 * @returns {{type: string, provider: *}}
 */
function sendEmailStart() {
  return {
    type: EMAIL_SEND_START
  }
}

/**
 * Action creator which should be dispatched on a successful email send.
 * @param {string} provider -  Provider name dispatched by the server.
 * @returns {{type: string, provider: *}}
 */
function sendEmailSuccess(provider) {
  return {
    type: EMAIL_SEND_SUCCESS,
    provider
  }
}

/**
 * Action creator which should be dispatched on a failed email send.
 * @param {string} error - Error message dispatched by the server, if available.
 * @returns {{type: string, provider: *}}
 */
function sendEmailFailure(error) {
  return {
    type: EMAIL_SEND_FAILURE,
    error
  }
}