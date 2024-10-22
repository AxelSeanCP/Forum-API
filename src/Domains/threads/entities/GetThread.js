class GetThread {
  constructor(threadPayload) {
    this._verifyThread(threadPayload);

    const { id, title, body, date, username, comments } = threadPayload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _verifyThread({ id, title, body, date, username, comments }) {
    if (!id || !title || !body || !date || !username || !comments) {
      throw new Error("GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string" ||
      !Array.isArray(comments)
    ) {
      throw new Error("GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = GetThread;
