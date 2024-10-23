const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddCommentUseCase = require("../AddCommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("AddCommentUseCase", () => {
  it("should throw error if use case payload not contain comment", async () => {
    const useCasePayload = {};
    const addCommentUseCase = new AddCommentUseCase({});

    await expect(
      addCommentUseCase.execute("", "", useCasePayload)
    ).rejects.toThrow("ADD_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT");
  });

  it("should throw error if comment not string", async () => {
    const useCasePayload = {
      content: 123,
    };
    const addCommentUseCase = new AddCommentUseCase({});

    await expect(
      addCommentUseCase.execute("", "", useCasePayload)
    ).rejects.toThrow(
      "ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should orchestrating the add comment action correctly", async () => {
    const useCasePayload = {
      content: "a comment",
    };

    const mockAddedComment = new AddedComment({
      id: "comment-123",
      content: useCasePayload.content,
      owner: "user-123",
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await getCommentUseCase.execute(
      "user-123",
      "thread-123",
      useCasePayload
    );

    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: "comment-123",
        content: useCasePayload.content,
        owner: "user-123",
      })
    );
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith("thread-123");
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
      "user-123",
      "thread-123",
      useCasePayload.content
    );
  });
});
