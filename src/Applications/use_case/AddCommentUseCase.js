class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { content } = useCasePayload;

    await this._threadRepository.checkThread(threadId);

    return this._commentRepository.addComment(userId, threadId, content);
  }

  _verifyPayload(useCasePayload) {
    const { content } = useCasePayload;

    if (!content) {
      throw new Error("ADD_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT");
    }

    if (typeof content !== "string") {
      throw new Error(
        "ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }
}

module.exports = AddCommentUseCase;
