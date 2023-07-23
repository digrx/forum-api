class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const threaddata = await this._threadRepository.getThread(useCasePayload);
    threaddata.username = threaddata.owner;
    delete threaddata.owner;
    const commentsdata = await this._commentRepository.getComment(useCasePayload);
    const comments = commentsdata.map((ubah) => {
      const _comment = {};
      _comment.id = ubah.id;
      _comment.username = ubah.owner;
      _comment.date = ubah.date;
      _comment.content = (ubah.deleted) ? '**komentar telah dihapus**' : ubah.content;
      return _comment;
    });
    threaddata.comments = comments;
    return threaddata;
  }
}

module.exports = GetThreadUseCase;
