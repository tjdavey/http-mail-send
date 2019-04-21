const {sendHandler} = require('./send');

describe('send endpoint', () => {
  describe('sendHandler', () => {
    const mockLog = jest.fn();
    const mockServer = {
      app: {
        pm: {
          send: jest.fn()
        }
      }
    };
    const mockResponse = {
      type: jest.fn(),
      code: jest.fn()
    };
    const mockH = {
      response: jest.fn().mockReturnValue(mockResponse)
    };

    afterEach(() => {
      // Clear all the recorded calls for all mocks
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    test('should send an email with the providerManager and succeed', async () => {
      const TEST_PROVIDER = 'testProvider';
      const TEST_REQUEST = {
        server: mockServer,
        log: mockLog,
        payload: {
          to: 'test@tristandavey.com',
          subject: 'Send Endpoint Test',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ' +
          'dolore magna aliqua.'
        }
      };

      // Mock a successful send from ProviderManager.
      mockServer.app.pm.send = jest.fn().mockResolvedValue({provider: TEST_PROVIDER});

      const handlerResponse = await sendHandler(TEST_REQUEST, mockH);

      // Validate that the payload has been correct passed to ProviderManager
      expect(mockServer.app.pm.send).toBeCalled();
      expect(mockServer.app.pm.send.mock.calls[0][0]).toBe(TEST_REQUEST.payload);
      // As log is re-bound we assume it should be a rebound function. We can't test this is a function due to a
      // jest issue: https://github.com/facebook/jest/issues/2549
      expect(mockServer.app.pm.send.mock.calls[0][1].log).toBeDefined();

      // Validate that the response is successfully formed and sent
      expect(mockH.response).toBeCalledWith({
        success: true,
        provider: TEST_PROVIDER
      });
      expect(mockResponse.type).toBeCalledWith('application/json');
      expect(mockResponse.code).toBeCalledWith(200);
      expect(handlerResponse).toBe(mockResponse);
    });

    test('should send an error is unable to send an email with the providerManager', async () => {
      const TEST_ERROR = new Error('Test Error');
      const TEST_REQUEST = {
        server: mockServer,
        log: mockLog,
        payload: {}
      };

      // Mock a an erroring send from ProviderManager.
      mockServer.app.pm.send = jest.fn().mockRejectedValue(TEST_ERROR);

      const handlerResponse = await sendHandler(TEST_REQUEST, mockH);

      // Validate that the payload has been correct passed to ProviderManager
      expect(mockServer.app.pm.send).toBeCalled();

      // Validate that the response is successfully formed and sent
      expect(mockH.response).toBeCalledWith({
        success: false,
        error: TEST_ERROR.message
      });
      expect(mockResponse.type).toBeCalledWith('application/json');
      expect(mockResponse.code).toBeCalledWith(500);
      expect(handlerResponse).toBe(mockResponse);
    });
  });

  describe('sendPayloadSchema', () => {
    // TODO: Write tests to validate payload schema.
  });
});