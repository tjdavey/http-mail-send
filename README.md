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

Further documentation on the usage of the docker-compose CLI, including
shutdown and log viewing can be found in the [docker-compose docs](
https://docs.docker.com/compose/reference/overview/).

#### Running tests

You can also run the full set of tests for the service in docker by
 running the following command.

```
docker-compose up http-mail-send-service-test
```

### Running the Frontend

## Configuration

### Environment Variables


## Development (and running the service locally).

### Prerequisites

- Node.js 10.x

### Service

#### Scripts

The following NPM scripts are provided and can be executed using
`npm run`

 - `start` - Start and run the service for local development.
 - `test` - Run the full test suite.
 - `cov` - Report test coverage.
 - `lint` - Lint the style and syntax of the code.

### Frontend