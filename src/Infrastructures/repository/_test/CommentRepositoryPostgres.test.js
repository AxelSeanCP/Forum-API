const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("CommentRepositoryPostgres", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe("addComment function", () => {
    it("should persist new comment", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      const content = "a comment";
      const fakeIdGenerator = () => "123"; //stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await commentRepositoryPostgres.addComment(
        "user-123",
        "thread-123",
        content
      );

      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );

      expect(comments).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      const content = "a comment";
      const fakeIdGenerator = () => "123"; //stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const addedComment = await commentRepositoryPostgres.addComment(
        "user-123",
        "thread-123",
        content
      );

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "a comment",
          owner: "user-123",
        })
      );
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should throw AuthorizationError if not owner", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({
        id: "comment-123",
        owner: "user-123",
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => {});

      const commentId = "comment-123";
      const userId = "user-6969";

      await expect(
        commentRepository.verifyCommentOwner(commentId, userId)
      ).rejects.toThrow(AuthorizationError);
    });

    it("should not throw AuthorizationError if owner", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({
        id: "comment-123",
        owner: "user-123",
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => {});

      const commentId = "comment-123";
      const userId = "user-123";

      await expect(
        commentRepository.verifyCommentOwner(commentId, userId)
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe("checkAvailabilityComment function", () => {
    it("should throw NotFoundError if comment not found", async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, () => {});

      const commentId = "comment-123";

      await expect(
        commentRepository.checkAvailabilityComment(commentId)
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError if comment found", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({
        id: "comment-123",
        owner: "user-123",
      });
      const commentRepository = new CommentRepositoryPostgres(pool, () => {});

      const commentId = "comment-123";

      await expect(
        commentRepository.checkAvailabilityComment(commentId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("deleteComment function", () => {
    it("should delete comment correctly", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({
        id: "comment-123",
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => {});

      const commentId = "comment-123";

      await commentRepository.deleteComment(commentId);

      const comment = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comment[0].content).toEqual("**komentar telah dihapus**");
      expect(comment[0].is_deleted).toEqual(true);
    });
  });
});
