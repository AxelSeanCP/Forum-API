class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.checkThread(threadId);

    const thread = await this._threadRepository.getThread(threadId);

    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    thread.comments = comments;

    return thread;
  }
}

module.exports = GetThreadUseCase;
