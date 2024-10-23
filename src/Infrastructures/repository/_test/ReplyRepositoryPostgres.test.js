const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe("ReplyRepositoryPostgres", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe("addReply function", () => {
    it("should persist new reply", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({ id: "comment-123" });
      const content = "a reply";
      const fakeIdGenerator = () => "123"; //stub

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await replyRepositoryPostgres.addReply(
        "user-123",
        "comment-123",
        content
      );

      const replies = await RepliesTableTestHelper.findRepliesById("reply-123");

      expect(replies).toHaveLength(1);
    });

    it("should return added reply correctly", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({ id: "comment-123" });
      const content = "a reply";
      const fakeIdGenerator = () => "123"; //stub

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const addedReply = await replyRepositoryPostgres.addReply(
        "user-123",
        "comment-123",
        content
      );

      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: "a reply",
          owner: "user-123",
        })
      );
    });
  });
});
