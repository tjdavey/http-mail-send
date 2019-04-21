# http-mail-send

HTTP Mail Send provides a HTTP interface for dispatching emails with
automatic failover between multiple email service providers. This allows
you to dispatch email more reliably if one of your providers is
unavailable. The email service providers, order in which they are
utilised and failover conditions can be fully configured as required.

## Architecture and Design

### Service

A simple manager which co-ordinates multiple pluggable *provider*
modules lies at the core of this implementation. This allows easy
extension of the service using either NPM modules or new files added to
the service itself. With simple modifications to the configuration these
new modules can be loaded to implement additional email service
providers in the service. This minimises code change for simple changes
to the way the service interacts with email service providers.

The HTTP server implementation is designed to wrap around the contained
logic with minimal crossover between application logic and server logic.
This makes the core service code reusable outside a HTTP server if
ever required.

The Sendgrid and Mailgun providers are implemented as these are the SDKs
I was most familiar with and both provide trivial interfaces with little
authentication complexity. The file provider was implemented to assist
in early debugging.

Hapi was chosen as the HTTP server for its seamless integration with
async/await and built-in validation using Joi. This provides a simple
mechanism to validate payloads sent to the /send endpoint ensuring
security are integrity are managed out of the box.

#### Decisions, Caveats and Known Issues

 - **Tests have been limited to critical paths only due to time
   constraints.** Easily tested parts (eg providers which can be
   tested manually with configuration changes) and validation
   handling have not been tested.
 - **ProviderManager has a lot of poorly structured code.** This should
   be broken down further to ease in testing and readability.
 - **Failover and reattempt logic is simplistic.** Ideally the
   logic for executing multiple attempts should have a configurable
   backoff, and possibly allow for short-circuit conditions. This was
   excluded due to time constraints.
 - **ProviderManager should be a singleton.** ProviderManager is
   currently setup as a normal class, but in context should be
   initialised as a singleton (outside of testing). This is effectively
   achieved in our application by initialising it with the server
   however, this is not a recommended practise, and would be refactored
   with additional time.
 - **No authentication or CSRF token implementation is included.** It is
   assumed that this service would be running inside a secured network
   or behind a secured API and did not require its own security
   or authentication mechanisms.

### Frontend

#### Decisions, Caveats and Known Issues

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/install/overview/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### TL;DR

Detailed instructions are below, but if you just want to run the whole
app subsitute the appropriate keys as required and run this command.

```
SENDGRID_API_KEY=<Sendgrid API Key> MAILGUN_API_KEY=<Mailgun API Key> docker-compose up service frontend
```


### Running the Service

The service can be run with docker and docker-compose  using the
following commands. It is recommended you pass-through any required
environment variables documented below using the
[recommended methods](https://docs.docker.com/compose/environment-variables/).

```
docker-compose up service
```

Once the service has started (this may take a few minutes) the server
will be available at http://localhost:8080.

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
docker-compose up service-test
```

### Running the Frontend

The service can be run with docker and docker-compose using the
following commands. The built docker container should NOT be used to
run the frontend in production.

```
docker-compose up frontend
```

Once the frontend server has started (this may take a few minutes) the
server will be available at http://localhost:8081.


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