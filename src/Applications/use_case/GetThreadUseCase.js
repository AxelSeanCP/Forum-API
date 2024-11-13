class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.checkThread(threadId);

    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    for (const comment of comments) {
      const likeCount = await this._commentRepository.getCommentLikeCountsById(
        comment.id
      );
      const replies = await this._replyRepository.getRepliesByCommentId(
        comment.id
      );

      comment.likeCount = likeCount;
      comment.replies = replies;
    }

    thread.comments = comments;

    return thread;
  }
}

module.exports = GetThreadUseCase;
