const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const GetThread = require("../../Domains/threads/entities/GetThread");
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
    const date = new Date().toISOString();

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
    const query = {
      text: `SELECT t.*, u.username
      FROM threads t
      LEFT JOIN users u ON t.owner = u.id
      WHERE t.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return new GetThread({
      ...result.rows[0],
      comments: [],
    });
  }
}

module.exports = ThreadRepositoryPostgres;
