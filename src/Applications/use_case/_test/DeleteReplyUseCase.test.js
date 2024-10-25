const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe("DeleteReplyUseCase", () => {
  it("should orchestrating the delete reply correctly", async () => {
    const replyId = "reply-123";
    const userId = "user-123";

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.checkAvailabilityReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(replyId, userId);

    expect(mockReplyRepository.checkAvailabilityReply).toHaveBeenCalledWith(
      replyId
    );
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(
      replyId,
      userId
    );
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(replyId);
  });
});
