const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const AddedReply = require("../../Domains/replies/entities/AddedReply");
const GetReply = require("../../Domains/replies/entities/GetReply");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(userId, commentId, content) {
    const id = `reply-${this._idGenerator()}`;
    const date = new Date();
    const isDeleted = false;

    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner",
      values: [id, content, userId, date, isDeleted, commentId],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT r.*, u.username
      FROM replies r
      LEFT JOIN users u ON u.id = r.owner
      WHERE r.comment_id = $1
      ORDER BY r.date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows.map(
      (reply) => new GetReply({ ...reply, date: reply.date.toISOString() })
    );
  }
}

module.exports = ReplyRepositoryPostgres;
