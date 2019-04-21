const packageInfo = require('../../package.json');
const {rootHandler} = require('./root');

describe('root endpoint', () => {
  const mockResponse = {
    type: jest.fn(),
    code: jest.fn()
  };
  const mockH = {
    response: jest.fn().mockReturnValue(mockResponse)
  };

  describe('rootHandler', () => {
    afterEach(() => {
      // Clear all the recorded calls for all mocks
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    test('should output the basic information about the service from package.json', async () => {
      const handlerResponse = await rootHandler({}, mockH);

      // Validate that the response is successfully formed and sent
      expect(mockH.response).toBeCalledWith({
        service: packageInfo.name,
        version: packageInfo.version
      });
      expect(mockResponse.type).toBeCalledWith('application/json');
      expect(mockResponse.code).toBeCalledWith(200);
      expect(handlerResponse).toBe(mockResponse);
    });
  });
});
