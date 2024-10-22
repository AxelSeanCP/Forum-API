const {
  GetThread,
} = require("../../../Domains/threads/entities/ThreadWithComments");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
  it("should orchestrating the get thread action correctly", async () => {
    const mockDate = new Date().toISOString();
    const mockGetThread = new GetThread(
      {
        id: "thread-123",
        title: "a thread",
        body: "a thread body",
        date: mockDate,
        username: "dicoding",
      },
      [
        {
          id: "comment-123",
          username: "dicoding",
          date: mockDate,
          content: "a comment",
        },
        {
          id: "comment-456",
          username: "dicoding",
          date: mockDate,
          content: "a comment",
        },
      ]
    );

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockGetThread));
    mockThreadRepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const thread = await getThreadUseCase.execute("thread-123");

    expect(thread).toEqual(
      new GetThread(
        {
          id: "thread-123",
          title: "a thread",
          body: "a thread body",
          date: mockDate,
          username: "dicoding",
        },
        [
          {
            id: "comment-123",
            username: "dicoding",
            date: mockDate,
            content: "a comment",
          },
          {
            id: "comment-456",
            username: "dicoding",
            date: mockDate,
            content: "a comment",
          },
        ]
      )
    );
    expect(mockThreadRepository.getThread).toHaveBeenCalledWith("thread-123");
  });
});
