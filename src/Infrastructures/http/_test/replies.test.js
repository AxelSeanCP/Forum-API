const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const {
  registerUserHelper,
  loginUserHelper,
  createThreadHelper,
  createCommentHelper,
  createReplyHelper,
} = require("./_testHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/replies endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe("when POST /replies", () => {
    it("should response 201 and persisted replies", async () => {
      const requestPayload = {
        content: "a reply",
      };

      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});
      const threadId = await createThreadHelper(server, accessToken, {});
      const commentId = await createCommentHelper(
        server,
        accessToken,
        threadId,
        {}
      );

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it("should response 400 when payload not contain reply", async () => {
      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});
      const threadId = await createThreadHelper(server, accessToken, {});
      const commentId = await createCommentHelper(
        server,
        accessToken,
        threadId,
        {}
      );

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {},
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("harus mengirimkan reply");
    });

    it("should response 400 when reply not string", async () => {
      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});
      const threadId = await createThreadHelper(server, accessToken, {});
      const commentId = await createCommentHelper(
        server,
        accessToken,
        threadId,
        {}
      );

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 123,
        },
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("reply harus string");
    });

    it("should response 404 when thread not found", async () => {
      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});
      const threadId = "xxx";
      const commentId = "xxx";

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: "a comment",
        },
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan");
    });

    it("should response 404 when comment not found", async () => {
      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});
      const threadId = await createThreadHelper(server, accessToken, {});
      const commentId = "xxx";

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: "a comment",
        },
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("comment tidak ditemukan");
    });
  });

  describe("when DELETE /replies", () => {
    it("should response 200 and soft delete the reply", async () => {
      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});
      const threadId = await createThreadHelper(server, accessToken, {});
      const commentId = await createCommentHelper(
        server,
        accessToken,
        threadId,
        {}
      );
      const replyId = await createReplyHelper(
        server,
        accessToken,
        threadId,
        commentId,
        {}
      );

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 404 when reply is not found", async () => {
      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});
      const threadId = await createThreadHelper(server, accessToken, {});
      const commentId = await createCommentHelper(
        server,
        accessToken,
        threadId,
        {}
      );
      const replyId = "reply-123";

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("reply tidak ditemukan");
    });

    it("should response 403 when not owner", async () => {
      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});
      const threadId = await createThreadHelper(server, accessToken, {});
      const commentId = await createCommentHelper(
        server,
        accessToken,
        threadId,
        {}
      );
      const replyId = await createReplyHelper(
        server,
        accessToken,
        threadId,
        commentId,
        {}
      );

      await registerUserHelper(server, {
        username: "axel",
        password: "sean",
        fullname: "Axel Sean",
      });
      const wrongToken = await loginUserHelper(server, {
        username: "axel",
        password: "sean",
      });

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { authorization: `Bearer ${wrongToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "anda tidak bisa mengakses resource ini"
      );
    });
  });
});
