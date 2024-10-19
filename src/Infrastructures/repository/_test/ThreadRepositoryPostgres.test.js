const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const pool = require("../../../Infrastructures/database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("threadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThreads function", () => {
    it("should persist new thread", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      const newThread = new NewThread({
        title: "title",
        body: "body",
      });
      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await threadRepositoryPostgres.addThread("user-123", newThread);

      const threads = await ThreadsTableTestHelper.findThreadsById(
        "thread-123"
      );
      expect(threads).toHaveLength(1);
    });

    it("should return added thread correctly", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      const newThread = new NewThread({
        title: "title",
        body: "body",
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const addedThread = await threadRepositoryPostgres.addThread(
        "user-123",
        newThread
      );

      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "title",
          owner: "user-123",
        })
      );
    });
  });

  describe("checkThread function", () => {
    it("should throw NotFoundError if thread not valid", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {}
      );
      const threadId = "xxx";

      await expect(
        threadRepositoryPostgres.checkThread(threadId)
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError if thread valid", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {}
      );
      const threadId = "thread-123";
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThreads({ id: "thread-123" });

      await expect(
        threadRepositoryPostgres.checkThread(threadId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });
});
