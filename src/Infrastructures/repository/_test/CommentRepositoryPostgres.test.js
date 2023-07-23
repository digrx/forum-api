const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        thread: 'thread-147147',
        content: 'Apakah ada tips untuk pencet beberapa tombol sekaligus saat reset?',
        owner: 'hanif',
      });
      const fakeIdGenerator = () => '123'; // stub! */
      await UsersTableTestHelper.addUser({ id: 'user-faris', username: 'faris' });
      await UsersTableTestHelper.addUser({ id: 'user-hanif', username: 'hanif' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-147147' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        thread: 'thread-147147',
        content: 'Apakah ada tips untuk pencet beberapa tombol sekaligus saat reset?',
        owner: 'hanif',
      });
      const fakeIdGenerator = () => '123';
      await UsersTableTestHelper.addUser({ id: 'user-faris', username: 'faris' });
      await UsersTableTestHelper.addUser({ id: 'user-hanif', username: 'hanif' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-147147' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        thread: 'thread-147147',
        content: 'Apakah ada tips untuk pencet beberapa tombol sekaligus saat reset?',
        owner: 'hanif',
      }));
    });
  });

  describe('find comment', () => {
    it('should pass when comment found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-faris', username: 'faris' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-147147' });
      await UsersTableTestHelper.addUser({ id: 'user-hanif', username: 'hanif' });
      await CommentsTableTestHelper.addComment({ id: 'comment-147147', thread: 'thread-147147' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
      const commentId = 'comment-147147';

      await expect(commentRepositoryPostgres.findComment(commentId))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should throw not found error when comment not found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-faris', username: 'faris' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-147147' });
      await UsersTableTestHelper.addUser({ id: 'user-hanif', username: 'hanif' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      await expect(commentRepositoryPostgres.findComment('comment-147147')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('delete comment', () => {
    it('should mark deleted to true in database', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-faris', username: 'faris' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-147147' });
      await UsersTableTestHelper.addUser({ id: 'user-hanif', username: 'hanif' });
      await CommentsTableTestHelper.addComment({ id: 'comment-147147', thread: 'thread-147147' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
      const commentId = 'comment-147147';

      await commentRepositoryPostgres.deleteComment(commentId);

      const comment = await CommentsTableTestHelper.findCommentsById(commentId);

      expect(comment[0].deleted).toEqual(true);
    });
  });

  describe('verify comment access', () => {
    it('should pass if owner created the comment', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-faris', username: 'faris' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-147147' });
      await UsersTableTestHelper.addUser({ id: 'user-hanif', username: 'hanif' });
      await CommentsTableTestHelper.addComment({ id: 'comment-147147', thread: 'thread-147147' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
      const payload = {
        threadId: 'thread-147147',
        commentId: 'comment-147147',
        owner: 'hanif',
      };

      await expect(commentRepositoryPostgres.verifyCommentAccess(payload))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should throw authorization error when thread not created by owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-faris', username: 'faris' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-147147' });
      await CommentsTableTestHelper.addComment({ id: 'comment-147147', owner: 'faris', thread: 'thread-147147' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
      const payload = {
        threadId: 'thread-147147',
        commentId: 'comment-147147',
        owner: 'hanif',
      };

      await expect(commentRepositoryPostgres.verifyCommentAccess(payload))
        .rejects.toThrowError(AuthorizationError);
    });
  });

  describe('getComment function', () => {
    it('should return Comment property correctly for a thread', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-faris', username: 'faris' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-147147' });
      await UsersTableTestHelper.addUser({ id: 'user-hanif', username: 'hanif' });
      await CommentsTableTestHelper.addComment({ id: 'comment-147147', thread: 'thread-147147' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      const threadId = 'thread-147147';
      const comments = await commentRepositoryPostgres.getComment(threadId);

      expect(comments[0]).toStrictEqual({
        thread: 'thread-147147',
        id: 'comment-147147',
        content: 'Apakah ada tips bagaimana menekan tombol tombol tersebut bersamaan?',
        owner: 'hanif',
        date: new Date('2023-07-04 16:15:40'),
        deleted: false,
      });
    });
  });
});
