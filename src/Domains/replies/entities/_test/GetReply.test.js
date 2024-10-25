const GetReply = require("../GetReply");

describe("a GetReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const replyPayload = {
      id: "reply-123",
      username: "dicoding",
      content: "a reply",
    };

    expect(() => new GetReply(replyPayload)).toThrow(
      "GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const replyPayload = {
      id: "reply-123",
      username: "dicoding",
      date: true,
      content: "a reply",
    };

    expect(() => new GetReply(replyPayload)).toThrow(
      "GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should map reply content to **balasan telah dihapus** when reply is deleted", () => {
    const replyPayload = {
      id: "reply-123",
      username: "dicoding",
      date: new Date().toISOString(),
      content: "a reply",
      is_deleted: true,
    };

    const getReply = new GetReply(replyPayload);

    expect(getReply.content).toEqual("**balasan telah dihapus**");
  });

  it("should create getReply entity correctly", () => {
    const replyPayload = {
      id: "reply-123",
      username: "dicoding",
      date: new Date().toISOString(),
      content: "a reply",
    };

    const getReply = new GetReply(replyPayload);

    expect(getReply.id).toEqual(replyPayload.id);
    expect(getReply.username).toEqual(replyPayload.username);
    expect(getReply.date).toEqual(replyPayload.date);
    expect(getReply.content).toEqual(replyPayload.content);
  });
});
