const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'Cara reset uniden BCD396XT',
        body: 'Tekan angka 2-4-9 dan tahan, kemudian hidupkan dengan pencet tombol power.',
        owner: 'faris',
      });
      const fakeIdGenerator = () => '123'; // stub!
      await UsersTableTestHelper.addUser({ username: 'faris' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'Cara reset uniden BCD396XT',
        body: 'Tekan angka 2-4-9 dan tahan, kemudian hidupkan dengan pencet tombol power.',
        owner: 'faris',
      });
      const fakeIdGenerator = () => '123'; // stub!
      await UsersTableTestHelper.addUser({ username: 'faris' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'Cara reset uniden BCD396XT',
        body: 'Tekan angka 2-4-9 dan tahan, kemudian hidupkan dengan pencet tombol power.',
        owner: 'faris',
      }));
    });
  });

  describe('getThread function', () => {
    it('should return thread property correctly', async () => {
      await UsersTableTestHelper.addUser({ username: 'faris' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
      const id = 'thread-123';
      const getThread = await threadRepositoryPostgres.getThread(id);

      // Assert
      expect(getThread).toStrictEqual({
        id: 'thread-123',
        title: 'Cara reset uniden BCD396XT',
        body: 'Tekan angka 2-4-9 dan tahan, kemudian hidupkan dengan pencet tombol power.',
        owner: 'faris',
        date: new Date('2023-07-04 06:15:40'),
      });
    });

    it('should throw not found error when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      await expect(threadRepositoryPostgres.getThread('thread-143543')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should pass if thread available', async () => {
      await UsersTableTestHelper.addUser({ username: 'faris' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should throw not found error when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-143543'))
        .rejects.toThrowError(NotFoundError);
    });
  });
});
