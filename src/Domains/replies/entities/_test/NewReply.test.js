const NewReply = require("../NewReply");

describe("a NewReply entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {};

    expect(() => new NewReply(payload)).toThrow(
      "NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      content: 123,
    };

    expect(() => new NewReply(payload)).toThrow(
      "NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create a NewReply entity correctly", () => {
    const payload = {
      content: "a reply",
    };

    const reply = new NewReply(payload);

    expect(reply.content).toEqual(payload.content);
  });
});
