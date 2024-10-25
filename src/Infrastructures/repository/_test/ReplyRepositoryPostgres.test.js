const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

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

  describe("checkAvailabilityReply function", () => {
    it("should throw NotFoundError if reply not found", async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        () => {}
      );

      await expect(
        replyRepositoryPostgres.checkAvailabilityReply("reply-123")
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError if reply found", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({ id: "comment-123" });
      await RepliesTableTestHelper.addReply({ id: "reply-123" });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        () => {}
      );

      await expect(
        replyRepositoryPostgres.checkAvailabilityReply("reply-123")
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("verifyReplyOwner function", () => {
    it("should throw AuthorizationError if not owner", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({ id: "comment-123" });
      await RepliesTableTestHelper.addReply({ id: "reply-123" });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        () => {}
      );

      await expect(
        replyRepositoryPostgres.verifyReplyOwner("reply-123", "user-xxx")
      ).rejects.toThrow(AuthorizationError);
    });

    it("should not throw AuthorizationError if owner", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({ id: "comment-123" });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        owner: "user-123",
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        () => {}
      );

      await expect(
        replyRepositoryPostgres.verifyReplyOwner("reply-123", "user-123")
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe("getRepliesWithCommentId function", () => {
    it("should return empty array when no replies is found", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({ id: "comment-123" });

      const replyRepository = new ReplyRepositoryPostgres(pool, () => {});

      const replies = await replyRepository.getRepliesByCommentId(
        "comment-123"
      );

      expect(replies).toHaveLength(0);
    });

    it("should return replies from a comment properly", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({
        id: "comment-123",
        content: "comment from 123",
        date: "2024-10-22",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        content: "reply from 123",
        date: "2024-10-24",
        commentId: "comment-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-456",
        content: "reply from 456",
        date: "2024-10-25",
        commentId: "comment-123",
      });
      const commentId = "comment-123";

      const replyRepository = new ReplyRepositoryPostgres(pool, () => {});

      const replies = await replyRepository.getRepliesByCommentId(commentId);

      expect(replies).toHaveLength(2);
      expect(replies[0]).toEqual(
        expect.objectContaining({
          id: "reply-123",
          username: "dicoding",
          date: expect.any(String),
          content: "reply from 123",
        })
      );
      expect(replies[1]).toEqual(
        expect.objectContaining({
          id: "reply-456",
          username: "dicoding",
          date: expect.any(String),
          content: "reply from 456",
        })
      );
    });
  });

  describe("deleteReply function", () => {
    it("should delete reply correctly", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({ id: "comment-123" });
      await RepliesTableTestHelper.addReply({ id: "reply-123" });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        () => {}
      );

      const replyId = "reply-123";

      await replyRepositoryPostgres.deleteReply(replyId);

      const reply = await RepliesTableTestHelper.findRepliesById(replyId);

      expect(reply[0].is_deleted).toEqual(true);
    });
  });
});
