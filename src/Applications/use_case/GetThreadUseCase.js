const DetailComments = require('../../Domains/comments/entities/DetailComments');

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
    threaddata.comments = commentsdata.map((data) => new DetailComments(data));

    return threaddata;
  }
}

module.exports = GetThreadUseCase;
