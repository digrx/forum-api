const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const DetailComments = require('../../../Domains/comments/entities/DetailComments');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const threadId = 'thread-147147';
    const threadDetail = {
      id: 'thread-147147',
      title: 'Cara reset uniden BCD396XT',
      body: 'Tekan angka 2-4-9 dan tahan, kemudian hidupkan dengan pencet tombol power.',
      username: 'faris',
      date: new Date('2023-07-04 06:15:40'),
      comments: [
        new DetailComments(
          {
            id: 'comment-147147',
            content: 'Apakah ada tips bagaimana menekan tombol tombol tersebut bersamaan?',
            owner: 'hanif',
            date: new Date('2023-07-06 12:22:11'),
            deleted: false,
          },
        ),
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getComment = jest.fn(() => Promise.resolve([
      {
        id: 'comment-147147',
        content: 'Apakah ada tips bagaimana menekan tombol tombol tersebut bersamaan?',
        owner: 'hanif',
        date: new Date('2023-07-06 12:22:11'),
        deleted: false,
      },
    ]));
    mockThreadRepository.getThread = jest.fn(() => Promise.resolve({
      id: 'thread-147147',
      title: 'Cara reset uniden BCD396XT',
      body: 'Tekan angka 2-4-9 dan tahan, kemudian hidupkan dengan pencet tombol power.',
      owner: 'faris',
      date: new Date('2023-07-04 06:15:40'),
    }));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const getThreadResult = await getThreadUseCase.execute(threadId);

    expect(getThreadResult).toStrictEqual(threadDetail);
    expect(mockThreadRepository.getThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.getComment).toBeCalledWith(threadId);
  });
});
