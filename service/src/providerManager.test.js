jest.mock('./providers/fileProvider');

const ProviderManager = require('./providerManager');
const FileProvider = require('./providers/fileProvider');

describe('ProviderManager', () => {
  describe('constructor', () => {
    beforeEach(() => {
      // Use FileProvider as a base for our mocks for convenience.
      FileProvider.mockImplementation((options) => {
        return {
          mockFileProvider: true,
          options
        };
      });
    });

    afterEach(() => {
      // Clear all the recorded calls for all mocks
      jest.clearAllMocks();

      // Reset any custom return values set on these in any tests
      FileProvider.mockReset();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    test('should initialise a ProviderManager with the required providers', () => {
      const TEST_PROVIDERS = {
        test1: {
          module: "./providers/fileProvider",
          options: {
            order: 1
          }
        },
        test2: {
          module: "./providers/fileProvider",
          options: {
            order: 2
          }
        }
      };
      const TEST_ORDER = ['test2', 'test1'];
      const TEST_FAILOVER_OPTIONS = {attempts: 1};

      const pm = new ProviderManager(TEST_PROVIDERS, TEST_ORDER, TEST_FAILOVER_OPTIONS);

      // Expect the providers to be loaded into the internal provider list in the required order
      expect(pm._providers[0]).toEqual({
        mockFileProvider: true,
        options: {
          order: 2
        }
      });
      expect(pm._providers[1]).toEqual({
        mockFileProvider: true,
        options: {
          order: 1
        }
      });
    });

    test('should handle errors when loading modules', async () => {
      const TEST_PROVIDERS = {
        error: {
          module: "./providers/fileProvider",
          options: {}
        }
      };
      const TEST_ORDER = ['error'];
      const TEST_ERROR = new Error('Test Error');

      FileProvider.mockImplementation(() => {
        throw TEST_ERROR;
      });

      //Wrap call to allow jest to detect exceptions;
      function testRun() {
        new ProviderManager(
        TEST_PROVIDERS,
        TEST_ORDER,
        {});
      }

      // Test a that the error is wrapped and the inner error message is shown
      expect(testRun).toThrow(`A provider module (error) could not be loaded: ${TEST_ERROR.message}`);
    });

    // TODO: Add tests for argument validation error cases and failoverOptions default overrides.

  });

  describe('send', () => {

    const TEST_PROVIDERS = {
      test1: {
        module: "./providers/fileProvider",
        options: {
          provider: 'test1'
        }
      },
      test2: {
        module: "./providers/fileProvider",
        options: {
          provider: 'test2'
        }
      }
    };
    const TEST_ORDER = ['test1', 'test2'];
    const TEST_SEND_OPTS = {
      to: 'noreply@tristandavey.com',
      subject: 'Test Message',
      body: 'Please Ignore'
    };

    const mockProviders = {
      test1: {
        send: jest.fn().mockResolvedValue()
      },
      test2: {
        send: jest.fn().mockResolvedValue()
      }
    };
    const mockLog = jest.fn();

    beforeEach(() => {
      // Use FileProvider as a base for our mocks for convenience.
      FileProvider.mockImplementation((options) => {
        // Provide a unique, known mock for each of the providers to help in failover testing.
        return mockProviders[options.provider];
      });
    });

    afterEach(() => {
      // Clear all the recorded calls for all mocks
      jest.clearAllMocks();

      // Reset any custom return values set on these in any tests
      mockProviders.test1.send.mockReset();
      mockProviders.test2.send.mockReset();
      mockLog.mockReset();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    test('should call send on the first configured provider', async () => {
      const pm = new ProviderManager(TEST_PROVIDERS, TEST_ORDER, {});

      await pm.send(TEST_SEND_OPTS, {log: mockLog});

      // Ensure the first provider is called only once when succeeding and with the correct params;
      expect(mockProviders.test1.send).toHaveBeenCalledTimes(1);
      expect(mockProviders.test1.send).toHaveBeenCalledWith(TEST_SEND_OPTS);

      // Ensure the second provider is not called
      expect(mockProviders.test2.send).not.toHaveBeenCalled();
    });

    test('should failover to the next provider after the specified number of attempts', async () => {
      const TEST_ATTEMPTS = 4;

      // Override the default action for the first provider mock to always fail.
      mockProviders.test1.send.mockRejectedValue(new Error('Test Error'));

      const pm = new ProviderManager(TEST_PROVIDERS, TEST_ORDER, {attempts: TEST_ATTEMPTS});

      await pm.send(TEST_SEND_OPTS, {log: mockLog});

      // Ensure the first provider is called the number of times required by attempt;
      expect(mockProviders.test1.send).toHaveBeenCalledTimes(TEST_ATTEMPTS);
      expect(mockProviders.test1.send).toHaveBeenCalledWith(TEST_SEND_OPTS);

      // Ensure the second provider is called with the correct args
      expect(mockProviders.test2.send).toHaveBeenCalledTimes(1);
      expect(mockProviders.test2.send).toHaveBeenCalledWith(TEST_SEND_OPTS);
    });

    test('should throw an exception if no providers are able to send', async () => {
      const TEST_ATTEMPTS = 1;

      // Override the default action for the first provider mock to always fail.
      mockProviders.test1.send.mockRejectedValue(new Error('Test Error'));
      mockProviders.test2.send.mockRejectedValue(new Error('Test Error'));

      const pm = new ProviderManager(TEST_PROVIDERS, TEST_ORDER, {attempts: TEST_ATTEMPTS});

      await expect(pm.send(TEST_SEND_OPTS, {log: mockLog})).rejects.toThrow('All providers failed to send');

      // Ensure the first provider is called the number of times required by attempts;
      expect(mockProviders.test1.send).toHaveBeenCalledTimes(TEST_ATTEMPTS);

      // Ensure the second provider is called the number of times required by attempts;
      expect(mockProviders.test2.send).toHaveBeenCalledTimes(TEST_ATTEMPTS);
    });
  });
});
