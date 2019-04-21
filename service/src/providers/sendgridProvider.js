const sendgrid = require('@sendgrid/mail');

/**
 * The Sendgrid is an email provider which allows you to send mail via Sendgrid's Web API v3.
 */
class SendgridProvider {

  /**
   * Constructs a SendgridProvider instance.
   *
   * @param {Object} options - A set of options for configuring this provider.
   * @param {string} options.apiKey - A Sendgrid API key. Required.
   * @param {string} options.from - The email address for the emails from this provider to tbe sent from. Required.
   */
  constructor({apiKey, from}) {
    this._sendgrid = sendgrid;
    this._sendgrid.setApiKey(apiKey);

    this._from = from;
  }

  /**
   * Sends an email with this provider
   *
   * @param {providerSendOptions} sendOptions - Options to be used by the provider to send the email. See providers.md
   * for more information on this object.
   */
  async send({to, subject, body}) {
    await sendgrid.send({
      to: to,
      from: this._from,
      subject: subject,
      html: body
    });
  }
}

module.exports = SendgridProvider;