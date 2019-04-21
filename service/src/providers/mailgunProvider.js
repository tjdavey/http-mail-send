var Mailgun = require("mailgun-js");

/**
 * The MailgunProvider is an email provider which allows you to send mail via Mailgun's Web API.
 */
class MailgunProvider {

  /**
   * Constructs a MailgunProvider instance.
   *
   * @param {Object} options - A set of options for configuring this provider.
   * @param {string} options.apiKey - A Sendgrid API key. Required.
   * @param {string} options.domain - The mailgun domain identifier. Required.
   * @param {string} options.from - The email address for the emails from this provider to tbe sent from. Required.
   */
  constructor({apiKey, domain, from}) {
    this._mailgun = Mailgun({
      apiKey,
      domain,
    });

    this._from = from;
  }

  /**
   * Sends an email with this provider
   *
   * @param {providerSendOptions} sendOptions - Options to be used by the provider to send the email. See providers.md
   * for more information on this object.
   */
  async send({to, subject, body}) {
    await this._mailgun.messages().send({
      to: to,
      from: this._from,
      subject: subject,
      html: body
    });
  }
}

module.exports = MailgunProvider;