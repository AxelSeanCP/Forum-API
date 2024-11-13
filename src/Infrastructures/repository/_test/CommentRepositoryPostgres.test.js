const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UserCommentLikesTableTestHelper = require("../../../../tests/UserCommentLikesTableTestHelper");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const GetComment = require("../../../Domains/comments/entities/GetComment");

describe("CommentRepositoryPostgres", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UserCommentLikesTableTestHelper.cleanTable();
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

  describe("getCommentsByThreadId function", () => {
    it("should return empty array when no comments is found", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });

      const commentRepository = new CommentRepositoryPostgres(pool, () => {});

      const comments = await commentRepository.getCommentsByThreadId(
        "thread-123"
      );

      expect(comments).toHaveLength(0);
    });

    it("should return comments from a thread correctly", async () => {
      const mockDate = new Date("2024-10-27").toISOString();
      const mockDate2 = new Date("2024-10-28").toISOString();
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({
        id: "comment-123",
        content: "comment from 123",
        date: mockDate,
      });
      await CommentsTableTestHelper.addComments({
        id: "comment-456",
        content: "comment from 456",
        date: mockDate2,
      });
      const threadId = "thread-123";

      const commentRepository = new CommentRepositoryPostgres(pool, () => {});

      const comments = await commentRepository.getCommentsByThreadId(threadId);

      expect(comments).toHaveLength(2);
      expect(comments[0]).toStrictEqual(
        new GetComment({
          id: "comment-123",
          username: "dicoding",
          date: mockDate,
          content: "comment from 123",
          likeCount: 0,
          replies: [],
        })
      );
      expect(comments[1]).toStrictEqual(
        new GetComment({
          id: "comment-456",
          username: "dicoding",
          date: mockDate2,
          content: "comment from 456",
          likeCount: 0,
          replies: [],
        })
      );
    });
  });

  describe("getCommentLikeCountsById function", () => {
    it("should return 0 when no likes is found", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({
        id: "comment-123",
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => {});

      const likeCount = await commentRepository.getCommentLikeCountsById(
        "comment-123"
      );

      expect(likeCount).toEqual(0);
    });

    it("should return likeCount properly", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({
        id: "comment-123",
      });
      await UserCommentLikesTableTestHelper.addLikes({
        commentId: "comment-123",
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => {});

      const likeCount = await commentRepository.getCommentLikeCountsById(
        "comment-123"
      );

      expect(likeCount).toEqual(1);
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
      expect(comment[0].is_deleted).toEqual(true);
    });
  });

  describe("isLikedByUser function", () => {
    it("should return true if user has liked the comment", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({
        id: "comment-123",
      });
      await UserCommentLikesTableTestHelper.addLikes({
        commentId: "comment-123",
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => {});

      const hasLiked = await commentRepository.isLikedByUser(
        "user-123",
        "comment-123"
      );

      expect(hasLiked).toEqual(true);
    });

    it("should return false if user hasn't liked the comment", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({
        id: "comment-123",
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => {});

      const hasLiked = await commentRepository.isLikedByUser(
        "user-123",
        "comment-123"
      );

      expect(hasLiked).toEqual(false);
    });
  });

  describe("addCommentLike function", () => {
    it("should persist new comment like", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({
        id: "comment-123",
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => {});

      await commentRepository.addCommentLike("user-123", "comment-123");

      const commentLike = await UserCommentLikesTableTestHelper.findLikes(
        "comment-123",
        "user-123"
      );

      expect(commentLike).toHaveLength(1);
    });
  });

  describe("removeCommentLike function", () => {
    it("should remove comment like", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
      await CommentsTableTestHelper.addComments({
        id: "comment-123",
      });
      await UserCommentLikesTableTestHelper.addLikes({
        commentId: "comment-123",
        userId: "user-123",
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => {});

      await commentRepository.removeCommentLike("user-123", "comment-123");

      const commentLike = await UserCommentLikesTableTestHelper.findLikes(
        "comment-123",
        "user-123"
      );

      expect(commentLike).toHaveLength(0);
    });
  });
});
