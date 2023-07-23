const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      thread: 'thread-147147',
      content: 'Apakah ada tips untuk pencet beberapa tombol sekaligus saat reset?',
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      thread: 123,
      content: 'Apakah ada tips untuk pencet beberapa tombol sekaligus saat reset?',
      owner: 'hanif',
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addComment object correctly', () => {
    const payload = {
      thread: 'thread-147147',
      content: 'Apakah ada tips untuk pencet beberapa tombol sekaligus saat reset?',
      owner: 'hanif',
    };

    const { thread, content, owner } = new AddComment(payload);

    expect(thread).toEqual(payload.thread);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
