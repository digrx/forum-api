const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Cara reset uniden BCD396XT',
        body: 'Tekan angka 2-4-9 dan tahan, kemudian hidupkan dengan pencet tombol power.',
        owner: 'faris',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'faris',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'faris',
          password: 'secret',
        },
      });
      const loginResponseJSON = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${loginResponseJSON.data.accessToken}`,
        },
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'faris',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'faris',
          password: 'secret',
        },
      });
      const loginResponseJSON = JSON.parse(loginResponse.payload);
      const requestPayload = {
        title: 'Cara reset uniden BCD396XT',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${loginResponseJSON.data.accessToken}`,
        },
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'faris',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'faris',
          password: 'secret',
        },
      });
      const loginResponseJSON = JSON.parse(loginResponse.payload);
      const requestPayload = {
        title: 'Cara reset uniden BCD396XT',
        body: 111,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${loginResponseJSON.data.accessToken}`,
        },
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and get thread details with comments', async () => {
      // Arrange
      const expectedResult = {
        id: 'thread-147147',
        title: 'Cara reset uniden BCD396XT',
        body: 'Tekan angka 2-4-9 dan tahan, kemudian hidupkan dengan pencet tombol power.',
        username: 'faris',
        date: new Date('2023-07-04 06:15:40'),
      };
      await UsersTableTestHelper.addUser({ id: 'user-faris', username: 'faris' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-147147' });
      await UsersTableTestHelper.addUser({ id: 'user-hanif', username: 'hanif' });
      await CommentsTableTestHelper.addComment({ thread: 'thread-147147' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-147147',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.id).toEqual(expectedResult.id);
      expect(responseJson.data.thread.body).toEqual(expectedResult.body);
    });
  });
});
