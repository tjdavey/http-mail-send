jest.mock('config');
jest.mock('./server');

const config = require('config');

const {startService} = require('./index');
const {initServer} = require('./server.js');
const packageInfo = require('../package.json');

describe('startService', () => {
  const TEST_SERVER_CONFIG = {
    port: 1234,
    host: 'test'
  };

  beforeEach(() => {
    initServer.mockResolvedValue();
    config.get.mockReturnValue(TEST_SERVER_CONFIG);
  });

  afterEach(() => {
    // Clear all the recorded calls for all mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Should initialise the server', async () => {
    await startService();

    // Ensure the server is initialised with the correctly merged configuration and packageInfo values.
    expect(initServer).toBeCalledWith({
      name: packageInfo.name,
      port: 1234,
      host: 'test'
    });
  });
})
