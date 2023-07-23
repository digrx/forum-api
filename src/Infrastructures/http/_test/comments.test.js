const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({ id: 'user-faris', username: 'faris' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-147147', owner: 'faris' });
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'hanif',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'hanif',
          password: 'secret',
        },
      });
      const loginResponseJSON = JSON.parse(loginResponse.payload);

      const requestPayload = {
        content: 'Apakah ada tips bagaimana menekan tombol tombol tersebut bersamaan?',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${loginResponseJSON.data.accessToken}`,
        },
        url: '/threads/thread-147147/comments',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and and mark comment deleted', async () => {
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({ id: 'user-faris', username: 'faris' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-147147' });
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'hanif',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'hanif',
          password: 'secret',
        },
      });
      const loginResponseJSON = JSON.parse(loginResponse.payload);
      await CommentsTableTestHelper.addComment({ id: 'comment-147147', owner: 'hanif' });

      const response = await server.inject({
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${loginResponseJSON.data.accessToken}`,
        },
        url: '/threads/thread-147147/comments/comment-147147',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
