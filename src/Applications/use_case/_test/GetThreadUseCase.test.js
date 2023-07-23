const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

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
        {
          id: 'comment-147147',
          content: 'Apakah ada tips bagaimana menekan tombol tombol tersebut bersamaan?',
          username: 'hanif',
          date: new Date('2023-07-06 12:22:11'),
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getComment = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-147147',
          content: 'Apakah ada tips bagaimana menekan tombol tombol tersebut bersamaan?',
          owner: 'hanif',
          date: new Date('2023-07-06 12:22:11'),
          deleted: false,
        },
      ]));
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve({
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

  it('should orchestrating the get thread action correctly with deleted comment', async () => {
    const threadId = 'thread-147147';
    const threadDetail = {
      id: 'thread-147147',
      title: 'Cara reset uniden BCD396XT',
      body: 'Tekan angka 2-4-9 dan tahan, kemudian hidupkan dengan pencet tombol power.',
      username: 'faris',
      date: new Date('2023-07-04 06:15:40'),
      comments: [
        {
          id: 'comment-148148',
          content: '**komentar telah dihapus**',
          username: 'faris',
          date: new Date('2023-07-10 12:22:11'),
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getComment = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-148148',
          content: '**komentar telah dihapus**',
          owner: 'faris',
          date: new Date('2023-07-10 12:22:11'),
          deleted: true,
        },
      ]));
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve({
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
    expect(getThreadResult.comments[0].content).toStrictEqual('**komentar telah dihapus**');
    expect(mockThreadRepository.getThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.getComment).toBeCalledWith(threadId);
  });
});
