const NewReply = require("../../Domains/replies/entities/NewReply");

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(userId, threadId, commentId, useCasePayload) {
    const { content } = new NewReply(useCasePayload);

    await this._threadRepository.checkThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);
    return this._replyRepository.addReply(userId, commentId, content);
  }
}

module.exports = AddReplyUseCase;
