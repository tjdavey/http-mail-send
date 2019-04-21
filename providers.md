# Providers

*Providers* allow HTTP Mail Send to interface with multiple email
sending services or processors.

Each *provider* consists of a configuration and a set of
code, called a *provider module*. The *provider module* implements an
interface between HTTP Mail Send and an email service or other
processor. For more information on providers see `providers.md`

*Providers* can be loaded and configured by creating key value pairs in
the `providers` object in `config/default.json` or an override file.
See the `README.md` file for more information on configuring
*providers*.

## Included Providers

### Sendgrid Provider

The Sendgrid provider allows you to send mail via Sendgrid's Web API v3.

*Module Path:* `./providers/sendgridProvider`

#### Options

- `apiKey` - A Sendgrid API key. Required.
- `from`- The email address for the emails from the Sendgrid provider
 will be sent from. Required.

### Mailgun Provider

The Mailgun provider allows you to send mail via Mailgun's Web API.

*Module Path:* `./providers/mailgunProvider`

#### Options

- `apiKey` - A Mailgun API key. Required.
- `domain` - The mailgun domain identifier. Required.
- `from`- The email address for the emails from the Mailgun provider
 will be sent from. Required.

### File Provider

The File provider allows you to output the arguments provided to an
email provider to a JSON file on the filesystem. This is designed to be
used for debugging and testing only.

*Module Path:* `./providers/fileProvider`

#### Options

- `filepath` - The filepath for emails captured by fileProvider to be
output to.


## Adding New Providers

TODO: Document interface for future contributors.