const GetThread = require("../GetThread");

describe("a GetThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const threadPayload = {
      id: "thread-123",
      title: "title",
      body: "body",
    };

    expect(() => new GetThread(threadPayload)).toThrow(
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
      comments: [],
    };

    expect(() => new GetThread(threadPayload)).toThrow(
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
      comments: [],
    };

    const getThread = new GetThread(threadPayload);

    expect(getThread.id).toEqual(threadPayload.id);
    expect(getThread.title).toEqual(threadPayload.title);
    expect(getThread.body).toEqual(threadPayload.body);
    expect(getThread.date).toEqual(threadPayload.date);
    expect(getThread.username).toEqual(threadPayload.username);
    expect(getThread.comments).toHaveLength(0);
  });
});
