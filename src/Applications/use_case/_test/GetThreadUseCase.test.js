const CommentRepository = require("../../../Domains/comments/CommentRepository");
const GetComment = require("../../../Domains/comments/entities/GetComment");
const GetThread = require("../../../Domains/threads/entities/GetThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
  it("should orchestrating the get thread action correctly", async () => {
    const mockDate = new Date().toISOString();
    const mockGetThread = new GetThread({
      id: "thread-123",
      title: "a thread",
      body: "a thread body",
      date: mockDate,
      username: "dicoding",
      comments: [],
    });

    const mockGetComment1 = new GetComment({
      id: "comment-123",
      username: "dicoding",
      date: mockDate,
      content: "a comment",
    });

    const mockGetComment2 = new GetComment({
      id: "comment-456",
      username: "dicoding",
      date: mockDate,
      content: "a comment",
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockGetThread));
    mockThreadRepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([mockGetComment1, mockGetComment2])
      );

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const thread = await getThreadUseCase.execute("thread-123");

    expect(thread).toEqual({
      id: "thread-123",
      title: "a thread",
      body: "a thread body",
      date: mockDate,
      username: "dicoding",
      comments: [
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
      ],
    });
    expect(mockThreadRepository.getThread).toHaveBeenCalledWith("thread-123");
  });
});
