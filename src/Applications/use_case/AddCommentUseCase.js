const NewComment = require("../../Domains/comments/entities/NewComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    const { content } = new NewComment(useCasePayload);

    await this._threadRepository.checkThread(threadId);

    return this._commentRepository.addComment(userId, threadId, content);
  }
}

module.exports = AddCommentUseCase;
