class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(replyId, userId) {
    await this._replyRepository.checkAvailabilityReply(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, userId);
    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
