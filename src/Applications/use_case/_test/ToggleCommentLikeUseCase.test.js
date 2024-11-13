const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ToggleCommentLikeUseCase = require("../ToggleCommentLikeUseCase");

describe("ToggleCommentLikeUseCase", () => {
  it("should orchestrating the addCommentLike action correctly when user hasn't liked", async () => {
    const userId = "user-123";
    const commentId = "comment-123";
    const threadId = "thread-123";

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.isLikedByUser = jest.fn(() => Promise.resolve(false));
    mockCommentRepository.addCommentLike = jest.fn(() => Promise.resolve());

    const ToggleCommentLike = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await ToggleCommentLike.execute(userId, commentId, threadId);

    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
      commentId
    );
    expect(mockCommentRepository.isLikedByUser).toHaveBeenCalledWith(
      userId,
      commentId
    );
    expect(mockCommentRepository.addCommentLike).toHaveBeenCalledWith(
      userId,
      commentId
    );
  });

  it("should orchestrating the removeCommentLike action correctly when user has already liked", async () => {
    const userId = "user-123";
    const commentId = "comment-123";
    const threadId = "thread-123";

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.isLikedByUser = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.removeCommentLike = jest.fn(() => Promise.resolve());

    const ToggleCommentLike = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await ToggleCommentLike.execute(userId, commentId, threadId);

    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
      commentId
    );
    expect(mockCommentRepository.isLikedByUser).toHaveBeenCalledWith(
      userId,
      commentId
    );
    expect(mockCommentRepository.removeCommentLike).toHaveBeenCalledWith(
      userId,
      commentId
    );
  });
});
