class ToggleCommentLikeUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, commentId, threadId) {
    await this._threadRepository.checkThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);
    const hasLiked = await this._commentRepository.isLikedByUser(
      userId,
      commentId
    );

    if (hasLiked) {
      await this._commentRepository.removeCommentLike(userId, commentId);
    } else {
      await this._commentRepository.addCommentLike(userId, commentId);
    }
  }
}

module.exports = ToggleCommentLikeUseCase;
