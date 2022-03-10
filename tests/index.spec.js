const nock = require('nock');
const index = require('../src/index');
const stubs = require('./stubs');
const invalidUserResponse = require('../src/invalidUserResponse');
const notFollowingResponse = require('../src/notFollowingResponse');
const followingResponse = require('../src/followingResponse');

jest.spyOn(global.console, 'log').mockImplementation(() => {});
jest.spyOn(global.console, 'error').mockImplementation(() => {});

jest.mock('../src/getSecrets', () => {
  return Promise.resolve({ access_token: 'foo', client_id: 'bar' });
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

    test('500 if getUser throws', async () => {
      nock('https://api.twitch.tv/helix').get('/users').query(true).reply(500);
      const event = {
        queryStringParameters: { u: 'dbkynd' },
      };
      const actual = await index.handler(event);
      expect(actual).toEqual({
        statusCode: 500,
        body: 'Internal Server Error',
      });
    });

    test('500 if getFollower throws', async () => {
      nock('https://api.twitch.tv/helix')
        .get('/users')
        .query(true)
        .reply(200, stubs.getUser);
      nock('https://api.twitch.tv/helix')
        .get('/users/follows')
        .query(true)
        .reply(500);
      const event = {
        queryStringParameters: { u: 'dbkynd' },
      };
      const actual = await index.handler(event);
      expect(actual).toEqual({
        statusCode: 500,
        body: 'Internal Server Error',
      });
    });

    test('invalid user response', async () => {
      nock('https://api.twitch.tv/helix')
        .get('/users')
        .query(true)
        .reply(200, { data: [] });

      const event = {
        queryStringParameters: { u: 'invalidUser' },
      };
      const actual = await index.handler(event);
      const html = invalidUserResponse('invalidUser');

      expect(actual).toMatchObject({
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: html,
      });
    });

    test('not following response', async () => {
      nock('https://api.twitch.tv/helix')
        .get('/users')
        .query(true)
        .reply(200, stubs.getUser);

      nock('https://api.twitch.tv/helix')
        .get('/users/follows')
        .query(true)
        .reply(200, { data: [] });

      const event = {
        queryStringParameters: { u: 'dbkynd' },
      };
      const actual = await index.handler(event);
      const html = notFollowingResponse(stubs.getUser.data[0].display_name);

      expect(actual).toMatchObject({
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: html,
      });
    });

    test('following response', async () => {
      nock('https://api.twitch.tv/helix', {
        reqheaders: {
          Authorization: `Bearer foo`,
          'Client-ID': 'bar',
        },
      })
        .get('/users')
        .query({
          login: 'dbkynd',
        })
        .reply(200, stubs.getUser);

      nock('https://api.twitch.tv/helix', {
        reqheaders: {
          Authorization: `Bearer foo`,
          'Client-ID': 'bar',
        },
      })
        .get('/users/follows')
        .query({
          from_id: stubs.getUser.data[0].id,
          to_id: '51533859',
        })
        .reply(200, stubs.getFollow);

      const event = {
        queryStringParameters: { u: 'dbkynd' },
      };
      const actual = await index.handler(event);
      const html = followingResponse(
        stubs.getUser.data[0].display_name,
        stubs.getFollow.data[0].followed_at,
      );

      expect(actual).toMatchObject({
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: html,
      });
    });
  });
});
