const index = require('../src/index');

jest.spyOn(index, 'getSecret').mockImplementation(() => {
  return Promise.resolve({ client_id: '', access_token: '' });
});

describe('followtime', () => {
  describe('handler', () => {
    test('no user query parameter', async () => {
      const event = {
        queryStringParameters: {},
      };
      const actual = await index.handler(event);
      expect(actual).toEqual({ statusCode: 400, body: 'Bad Request' });
    });
  });
});
