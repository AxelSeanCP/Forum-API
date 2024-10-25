const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const {
  registerUserHelper,
  loginUserHelper,
  createThreadHelper,
  createCommentHelper,
  createReplyHelper,
} = require("./_testHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/threads endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should response 201 and persisted threads", async () => {
      const requestPayload = {
        title: "title",
        body: "body",
      };

      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe("when GET /threads", () => {
    it("should response 200 and return thread with comments and replies", async () => {
      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});
      const threadId = await createThreadHelper(server, accessToken, {});
      const commentId = await createCommentHelper(
        server,
        accessToken,
        threadId,
        {
          content: "comment no 1",
        }
      );
      await createCommentHelper(server, accessToken, threadId, {
        content: "comment no 2",
      });
      await createReplyHelper(server, accessToken, threadId, commentId, {
        content: "reply no 1",
      });
      await createReplyHelper(server, accessToken, threadId, commentId, {
        content: "reply no 2",
      });

      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
    });

    it("should response 404 when thread not found", async () => {
      const server = await createServer(container);

      const threadId = "xxx";

      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan");
    });
  });
});
