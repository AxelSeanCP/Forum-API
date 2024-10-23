class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(userId, threadId, commentId, useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { content } = useCasePayload;

    await this._threadRepository.checkThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);
    return this._replyRepository.addReply(userId, commentId, content);
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error("ADD_REPLY_USE_CASE.NOT_CONTAIN_REPLY");
    }

    if (typeof content !== "string") {
      throw new Error(
        "ADD_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }
}

module.exports = AddReplyUseCase;
