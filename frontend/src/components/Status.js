import React, { Component } from 'react';

const PROVIDER_ENUM = {
  FileProvider: 'File System',
  MailgunProvider: 'Mailgun',
  SendgridProvider: 'Sendgrid'
}

/**
 * Status message shown after sending emails.
 */
class Status extends Component {
  render() {
    const {lastSent} = this.props;

    return (
      <div className={`status ${(lastSent.success && 'text-success') || 'text-danger'}`}>
        {lastSent.success && (
          <span>
            Your email was successfully sent with {PROVIDER_ENUM[lastSent.provider] || 'an unknown provider'}
          </span>
        )}
        {!lastSent.success && (
          <span>
            Your email failed to send due to an error: {lastSent.error || 'Unknown Error'}
          </span>
        )}
      </div>
    );
  }
}

export default Status;