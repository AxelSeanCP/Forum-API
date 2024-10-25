class GetReply {
  constructor(replyPayload) {
    this._verifyPayload(replyPayload);

    const { id, username, date, content } = this._mapReply(replyPayload);

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
  }

  _verifyPayload({ id, username, date, content }) {
    if (!id || !username || !date || !content) {
      throw new Error("GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof date !== "string" ||
      typeof content !== "string"
    ) {
      throw new Error("GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }

  _mapReply(reply) {
    return {
      ...reply,
      content: reply.is_deleted ? "**balasan telah dihapus**" : reply.content,
    };
  }
}

module.exports = GetReply;
