const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const {
  GetThread,
} = require("../../Domains/threads/entities/ThreadWithComments");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(userId, newThread) {
    const { title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner",
      values: [id, title, body, date, userId],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async checkThread(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }

  async getThread(threadId) {
    const threadQuery = {
      text: `SELECT t.*, u.username
      FROM threads t
      LEFT JOIN users u ON t.owner = u.id
      WHERE t.id = $1`,
      values: [threadId],
    };

    const threadResult = await this._pool.query(threadQuery);

    const commentQuery = {
      text: `SELECT c.*, u.username
      FROM comments c
      LEFT JOIN users u ON u.id = c.owner
      WHERE c.thread_id = $1
      ORDER BY c.date ASC`,
      values: [threadId],
    };

    const commentResult = await this._pool.query(commentQuery);

    const threadData = {
      ...threadResult.rows[0],
      date: threadResult.rows[0].date.toISOString(),
    };
    const commentData = commentResult.rows.map((comment) => ({
      ...comment,
      date: comment.date.toISOString(),
    }));

    return new GetThread(threadData, commentData);
  }
}

module.exports = ThreadRepositoryPostgres;
