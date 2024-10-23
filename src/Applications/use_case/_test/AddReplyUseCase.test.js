const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddReplyUseCase = require("../AddReplyUseCase");

describe("AddReplyUseCase", () => {
  it("should throw error if payload not contain reply", async () => {
    const useCasePayload = {};
    const addReplyUseCase = new AddReplyUseCase({});

    await expect(
      addReplyUseCase.execute("", "", "", useCasePayload)
    ).rejects.toThrow("ADD_REPLY_USE_CASE.NOT_CONTAIN_REPLY");
  });

  it("should throw error if reply not string", async () => {
    const useCasePayload = {
      content: 123,
    };
    const addReplyUseCase = new AddReplyUseCase({});

    await expect(
      addReplyUseCase.execute("", "", "", useCasePayload)
    ).rejects.toThrow(
      "ADD_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should orchestrating the addReply action correctly", async () => {
    const useCasePayload = {
      content: "a reply",
    };

    const mockAddedReply = new AddedReply({
      id: "reply-123",
      content: useCasePayload.content,
      owner: "user-123",
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const addedReply = await addReplyUseCase.execute(
      "user-123",
      "thread-123",
      "comment-123",
      useCasePayload
    );

    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: "reply-123",
        content: useCasePayload.content,
        owner: "user-123",
      })
    );

    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith("thread-123");
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
      "comment-123"
    );
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(
      "user-123",
      "comment-123",
      useCasePayload.content
    );
  });
});
