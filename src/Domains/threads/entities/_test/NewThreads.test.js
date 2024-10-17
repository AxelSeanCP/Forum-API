const NewThread = require("../NewThread");

describe("a NewThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      title: "abc",
    };

    expect(() => new NewThread(payload)).toThrow(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      title: 123,
      body: "abc",
    };

    expect(() => new NewThread(payload)).toThrow(
      "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create newThread object correctly", () => {
    const payload = {
      title: "a thread",
      body: "a body",
    };

    const { title, body } = new NewThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
