class GetComment {
  constructor(commentPayload) {
    this._verifyComment(commentPayload);

    const { id, username, date, content } = this._mapComment(commentPayload);

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
  }

  _verifyComment({ id, username, date, content }) {
    if (!id || !username || !date || !content) {
      throw new Error("GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof date !== "string" ||
      typeof content !== "string"
    ) {
      throw new Error("GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
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

class GetThread {
  constructor(threadPayload, commentPayload) {
    this._verifyThread(threadPayload);

    const { id, title, body, date, username } = threadPayload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = commentPayload.map((comment) => new GetComment(comment));
  }

  _verifyThread({ id, title, body, date, username }) {
    if (!id || !title || !body || !date || !username) {
      throw new Error("GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string"
    ) {
      throw new Error("GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = { GetThread, GetComment };
