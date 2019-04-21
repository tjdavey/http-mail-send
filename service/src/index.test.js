jest.mock('config');
jest.mock('./server');
jest.mock('./providerManager');

const config = require('config');

const {startService} = require('./index');
const {initServer} = require('./server.js');
const ProviderManager = require('./providerManager.js');
const packageInfo = require('../package.json');

describe('startService', () => {
  const TEST_CONFIG = {
    server: {
      port: 1234,
      host: 'test'
    },
    providers: {
      providerConfig: true
    },
    providerOrder: ['ordered', 'providers'],
    providerFailoverOptions: {
      failoverOptions: true
    }
  };
  const TEST_PROVIDER_MANAGER = {};

  beforeEach(() => {
    initServer.mockResolvedValue();
    ProviderManager.mockImplementation(() => {
      return TEST_PROVIDER_MANAGER;
    });
    config.get.mockImplementation((key) => {
      return TEST_CONFIG[key];
    });
  });

  afterEach(() => {
    // Clear all the recorded calls for all mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Should initialise the provider manager & server', async () => {
    await startService();

    // Ensure the ProviderManager is initialised with configuration.
    expect(ProviderManager).toBeCalledWith(
      TEST_CONFIG.providers,
      TEST_CONFIG.providerOrder,
      TEST_CONFIG.providerFailoverOptions
    );

    // Ensure the server is initialised with the correctly merged configuration and packageInfo values.
    expect(initServer).toBeCalledWith({
      name: packageInfo.name,
      port: TEST_CONFIG.server.port,
      host: TEST_CONFIG.server.host,
      app: {pm: TEST_PROVIDER_MANAGER}
    });
  });
});
