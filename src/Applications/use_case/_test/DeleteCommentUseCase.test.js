const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should orchestrating the delete comment correctly", async () => {
    const commentId = "comment-123";
    const userId = "user-123";

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(commentId, userId);

    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
      commentId,
      userId
    );
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
      commentId
    );
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(commentId);
  });
});
