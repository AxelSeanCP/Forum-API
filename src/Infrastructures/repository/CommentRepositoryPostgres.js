const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const GetComment = require("../../Domains/comments/entities/GetComment");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(userId, threadId, content) {
    const id = `comment-${this._idGenerator()}`;
    const date = new Date();
    const isDeleted = false;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner",
      values: [id, content, date, userId, threadId, isDeleted],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentOwner(commentId, userId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1 AND owner = $2",
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError("anda tidak bisa mengakses resource ini");
    }
  }

  async checkAvailabilityComment(commentId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("comment tidak ditemukan");
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.*, u.username
      FROM comments c
      LEFT JOIN users u ON u.id = c.owner
      WHERE c.thread_id = $1
      ORDER BY c.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows.map(
      (comment) =>
        new GetComment({ ...comment, date: comment.date.toISOString() })
    );
  }

  async deleteComment(commentId) {
    const query = {
      text: "UPDATE comments SET is_deleted = true WHERE id = $1",
      values: [commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
