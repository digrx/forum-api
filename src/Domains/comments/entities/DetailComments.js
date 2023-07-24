class DetailComments {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, owner, date, content, deleted,
    } = payload;

    this.id = id;
    this.username = owner;
    this.date = date;
    this.content = deleted ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({ id, owner, date, content, deleted }) {
    if (!id || !content || !date || !owner) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || !(date instanceof Date)
      || typeof deleted !== 'boolean' || typeof owner !== 'string') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = DetailComments;
