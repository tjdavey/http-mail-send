const fs = require('fs').promises;
const path = require('path');

/**
 * Default file path for email data to be output to.
 * @type {string}
 */
const DEFAULT_FILEPATH = './tmp/emails';

/**
 * The FileProvider is an email provider which allows you to output the arguments provided to an email provider to
 * a JSON file on the filesystem. This is designed to be used for debugging and testing only.
 */
class FileProvider {

  /**
   * Constructs a FileProvider instance.
   *
   * @param {Object} options - A set of options for configuring this provider.
   * @param {string} options.filepath - The filepath for emails captured by fileProvider to be output to.
   */
  constructor({filePath = DEFAULT_FILEPATH}) {
    this._filePath = filePath;
  }

  /**
   * Sends an email with this provider
   *
   * @param {providerSendOptions} sendOptions - Options to be used by the provider to send the email. See providers.md
   * for more information on this object.
   */
  async send(sendOptions) {
    const filePath = path.join(this._filePath, `${new Date().toISOString()}.json`);

    await fs.writeFile(filePath, JSON.stringify(sendOptions));
  }

}

module.exports = FileProvider;