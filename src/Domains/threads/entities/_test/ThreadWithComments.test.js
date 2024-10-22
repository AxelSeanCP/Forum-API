const { GetThread, GetComment } = require("../ThreadWithComments");

describe("a GetComment entities", () => {
  it("should map comment content to '**konten telah dihapus**' when comment is deleted", () => {
    const commentPayload = {
      id: "comment-123",
      content: "a comment",
      date: new Date().toISOString(),
      username: "dicoding",
      is_deleted: true,
    };

    const getComment = new GetComment(commentPayload);

    expect(getComment.content).toEqual("**konten telah dihapus**");
  });
});

describe("a GetThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const threadPayload = {
      id: "thread-123",
      title: "title",
      body: "body",
    };

    const commentPayload = [
      {
        id: "comment-123",
        content: "a comment",
      },
    ];

    expect(() => new GetThread(threadPayload, commentPayload)).toThrow(
      "GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const threadPayload = {
      id: "thread-123",
      title: "title",
      body: {},
      date: true,
      username: "dicoding",
    };

    const commentPayload = [
      {
        id: 123,
        content: "a comment",
        date: new Date().toISOString(),
        username: "dicoding",
        thread_id: "thread-123",
        is_deleted: 10,
      },
    ];

    expect(() => new GetThread(threadPayload, commentPayload)).toThrow(
      "GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create getThread entity correctly", () => {
    const threadPayload = {
      id: "thread-123",
      title: "title",
      body: "body",
      date: new Date().toISOString(),
      username: "dicoding",
    };

    const commentPayload = [
      {
        id: "comment-123",
        content: "a comment",
        date: new Date().toISOString(),
        username: "dicoding",
        thread_id: "thread-123",
        is_deleted: false,
      },
    ];

    const getThread = new GetThread(threadPayload, commentPayload);

    expect(getThread.id).toEqual(threadPayload.id);
    expect(getThread.title).toEqual(threadPayload.title);
    expect(getThread.body).toEqual(threadPayload.body);
    expect(getThread.date).toEqual(threadPayload.date);
    expect(getThread.username).toEqual(threadPayload.username);

    expect(getThread.comments).toHaveLength(1);
    expect(getThread.comments[0].id).toEqual(commentPayload[0].id);
    expect(getThread.comments[0].username).toEqual(commentPayload[0].username);
    expect(getThread.comments[0].date).toEqual(commentPayload[0].date);
    expect(getThread.comments[0].content).toEqual(commentPayload[0].content);
  });
});
