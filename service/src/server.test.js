const Hapi = require('hapi');
const bunyan = require('bunyan');

const {initServer} = require('./server.js');
const {setupRoutes} = require('./routes');

jest.mock('bunyan');
jest.mock('hapi');
jest.mock('./routes');

describe('initServer', () => {
  const TEST_PORT = '1234';
  const TEST_HOST = 'testhost';
  const TEST_NAME = 'test-server';
  const TEST_LOGLEVEL = 'info';
  const TEST_CORS_ORIGINS = ['*'];
  const TEST_APP = {app: true};

  const hapiServer = {
    register: jest.fn().mockResolvedValue(),
    start: jest.fn().mockResolvedValue(),
    app: {},
    info: {
      uri: 'testserveruri'
    }
  };

  const bunyanLogger = {
    info: jest.fn(),
    error: jest.fn()
  };

  beforeEach(() => {
    bunyan.createLogger.mockReturnValue(bunyanLogger);
    Hapi.Server.mockReturnValue(hapiServer);
  });

  afterEach(() => {
    // Clear all the recorded calls for all mocks
    jest.clearAllMocks();

    // Reset any custom return values set on these in any tests
    bunyan.createLogger.mockReset();
    Hapi.Server.mockReset();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should initialise a logger and server successfully', async () => {
    const testServer = await initServer({
      port: TEST_PORT,
      host: TEST_HOST,
      name: TEST_NAME,
      logLevel: TEST_LOGLEVEL,
      corsOrigins: TEST_CORS_ORIGINS,
      app: TEST_APP
    });

    // Ensure the logger was setup as required
    expect(bunyan.createLogger).toHaveBeenCalledWith({name: TEST_NAME, level: TEST_LOGLEVEL});

    // Ensure the server was setup as required
    expect(Hapi.server).toHaveBeenCalledWith({
      port: TEST_PORT,
      host: TEST_HOST,
      routes: {
        cors: {
          origin: TEST_CORS_ORIGINS
        }
      }
    });

    // Ensure routes were configured
    expect(setupRoutes).toHaveBeenCalledWith(hapiServer);

    // Ensure plugins were registered. This is a complex object that may change with time. Avoid testing specifics.
    expect(hapiServer.register).toHaveBeenCalled();

    // Ensure the server.app property was initialised with any application globals
    expect(hapiServer.app).toEqual(TEST_APP);

    // Ensure the server started and the correct data was logged
    expect(hapiServer.start).toHaveBeenCalled();
    expect(bunyanLogger.info).toHaveBeenCalled();
    expect(testServer).toBe(hapiServer);
  });

  test('should handle an error in server initialisation', async () => {
    const TEST_ERROR = new Error('Test Error');

    // Override the default mocked behavior of server.start to reject with an error (same as async throw).
    hapiServer.start.mockRejectedValue(TEST_ERROR);

    // Ensure our call rejects
    await expect(initServer({
      port: TEST_PORT,
      host: TEST_HOST,
      name: TEST_NAME,
      logLevel: TEST_LOGLEVEL
    })).rejects.toThrow(TEST_ERROR);

    // Ensure the server started and the correct data was logged
    expect(bunyanLogger.error).toHaveBeenCalled();
  });
});