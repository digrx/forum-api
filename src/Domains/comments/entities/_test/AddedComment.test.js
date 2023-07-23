const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      thread: 'thread-147147',
      content: 'Apakah ada tips untuk pencet beberapa tombol sekaligus saat reset?',
      owner: 'hanif',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      thread: 'thread-147147',
      content: 'Apakah ada tips untuk pencet beberapa tombol sekaligus saat reset?',
      owner: 'hanif',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-147147',
      thread: 'thread-147147',
      content: 'Apakah ada tips untuk pencet beberapa tombol sekaligus saat reset?',
      owner: 'hanif',
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.thread).toEqual(payload.thread);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
