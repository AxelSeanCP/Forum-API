class GetComment {
  constructor(commentPayload) {
    this._verifyPayload(commentPayload);

    const { id, username, date, content } = this._mapComment(commentPayload);

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
  }

  _verifyPayload({ id, username, date, content }) {
    if (!id || !username || !date || !content) {
      throw new Error("GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof date !== "string" ||
      typeof content !== "string"
    ) {
      throw new Error("GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }

  _mapComment(comment) {
    return {
      ...comment,
      content: comment.is_deleted
        ? "**komentar telah dihapus**"
        : comment.content,
    };
  }
}

module.exports = GetComment;
