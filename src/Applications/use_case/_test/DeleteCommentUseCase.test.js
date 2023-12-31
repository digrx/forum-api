const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-147147',
      commentId: 'comment-147147',
      owner: 'hanif',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAccess = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailabilty = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadAvailability)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAccess)
      .toHaveBeenCalledWith(useCasePayload);
    expect(mockCommentRepository.verifyCommentAvailabilty)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
  });
});
