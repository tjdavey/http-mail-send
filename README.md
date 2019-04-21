# http-mail-send
Sends mail via HTTP with redundant failover. 

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/install/overview/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Service

The service can be run with docker and docker-compose  using the
following commands. It is recommended you pass-through any required
environment variables (see 'Configuration' section below) using the
[recommended methods](https://docs.docker.com/compose/environment-variables/).

```
docker-compose up http-mail-send-service
```

Using the default configuration the following environment variables
must be defined in order to correctly configure the service.

- `SENDGRID_API_KEY` - A sendgrid API key for sending emails through
 Sendgrid.

Further documentation on the usage of the docker-compose CLI, including
shutdown and log viewing can be found in the [docker-compose docs](https://docs.docker.com/compose/reference/overview/).

#### Running tests

You can also run the full set of tests for the service in docker by
 running the following command.

```
docker-compose up http-mail-send-service-test
```

### Running the Frontend

## Configuration

A number of settings for http-mail-send can be configured through the
JSON configuration files or through environment variables.

The JSON configuration files can be configured with overrides for
local development or additional environments. For more information on
this see the [node-config documentation](https://github.com/lorenwest/node-config/wiki/Configuration-Files).

### Server Configuration

The following properties can be configured in the `server` object in
`config/default.json` or an override file.

- `port` - HTTP server port. Default: `8080`
- `host` - HTTP server hostname. Default: `localhost`

### Provider Configuration

HTTP Send Mail can be configured to dynamically load and configure
email *providers*. *Providers* consist of a configuration and a set of
code, called a *provider module*. The *provider module* implements an
interface between HTTP Mail Send and an email service or other
processor. For more information on providers see `providers.md`

*Providers* can be loaded and configured by creating key value pairs in
the `providers` object in `config/default.json` or an override file.

Each provider configuration must:
- have a unique key
- have the following keys:
  - `module` - a valid provider module path, if relative it is
  relative to the root of the service. Also accepts NPM module paths.
  - `options` - a set of options for the email provider.

You can load the same provider module multiple times with different
configurations.

The required options for each provider can be found in the provider
documentation for the class constructor. It is recommended that
secrets (eg. passwords and keys) are not stored in configuration and
instead utilise [node-config's custom environment variables](https://github.com/lorenwest/node-config/wiki/Environment-Variables#custom-environment-variables)
feature to allow you to set these through environment variables.

#### Example Configuration

```
  "providers": {
    "file": {
      "module": "./providers/file",
      "options": {
        "filepath": "./tmp/fileProvider"
      }
    },
    "sendgrid": {
      "module": "./providers/sendgrid",
      "options": {
        "from": "noreply@tristandavey.com"
      }
    }
  },
```

### Provider Order Configuration

The order in which providers are utilised and fail over can be
configured in the `providerOrder` array in `config/default.json` or an
 override file. Each *string* in the `providerOrder` array MUST
 correspond to a key in the `providers` object.

#### Example Configuration

```
  "providerOrder": ["sendgrid", "file"],
```

### Failover Configuration

The conditions under which HTTP Mail Send will fail over between
providers can be configured using the `providerFailoverOptions` object
in `config/default.json` or an override file.

The following keys can be set:
- `attempt` - *Number* - The number of attempts to make for each
 provider in `providerOrder`.

## Development (and running the service locally).

### Prerequisites

- Node.js 10.x

### Service

The service can be run locally by having the prerequisites installed and
running `npm install` to install all required dependencies.

#### Scripts

The following NPM scripts are provided and can be executed using
`npm run`

 - `start` - Start and run the service for local development.
 - `test` - Run the full test suite.
 - `cov` - Report test coverage.
 - `lint` - Lint the style and syntax of the code.

### Frontend