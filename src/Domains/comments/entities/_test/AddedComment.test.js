const AddedComment = require("../AddedComment");

describe("a AddedComment entity", () => {
  it("should throw error when payload not contain needed property", () => {
    const payload = {
      id: "user-123",
      content: "a comment",
    };

    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: 123,
      content: "a comment",
      owner: {},
    };

    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addedComment entity correctly", () => {
    const payload = {
      id: "comment-123",
      content: "a comment",
      owner: "user-123",
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
