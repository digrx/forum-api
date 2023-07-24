const DetailComments = require('../DetailComments');

describe('a DetailComments entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-147147',
      content: 'Apakah ada tips untuk pencet beberapa tombol sekaligus saat reset?',
      owner: 'hanif',
    };

    expect(() => new DetailComments(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-147147',
      content: 'Apakah ada tips untuk pencet beberapa tombol sekaligus saat reset?',
      owner: 'hanif',
      deleted: 'salah',
      date: new Date(),
    };

    // Action and Assert
    expect(() => new DetailComments(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-147147',
      content: 'Apakah ada tips untuk pencet beberapa tombol sekaligus saat reset?',
      owner: 'hanif',
      deleted: true,
      date: new Date(),
    };

    const detailComment = new DetailComments(payload);

    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.content).toEqual('**komentar telah dihapus**');
    expect(detailComment.username).toEqual(payload.owner);
    expect(detailComment.date).toEqual(payload.date);
  });
});
