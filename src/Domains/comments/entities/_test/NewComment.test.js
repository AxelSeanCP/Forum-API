const NewComment = require("../NewComment");

describe("a NewComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {};

    expect(() => new NewComment(payload)).toThrow(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      content: 123,
    };

    expect(() => new NewComment(payload)).toThrow(
      "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create NewComment entity correctly", () => {
    const payload = {
      content: "a comment",
    };

    const comment = new NewComment(payload);

    expect(comment.content).toEqual(payload.content);
  });
});
