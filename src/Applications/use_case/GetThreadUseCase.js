class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.checkThread(threadId);
    return this._threadRepository.getThread(threadId);
  }
}

module.exports = GetThreadUseCase;
