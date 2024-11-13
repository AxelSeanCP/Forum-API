const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const {
  registerUserHelper,
  loginUserHelper,
  createThreadHelper,
  createCommentHelper,
} = require("./_testHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/comments endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe("when POST /comments", () => {
    it("should response 201 and persisted comments", async () => {
      const requestPayload = {
        content: "a comment",
      };

      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});
      const threadId = await createThreadHelper(server, accessToken, {});

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it("should response 400 when payload not contain comment", async () => {
      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});
      const threadId = await createThreadHelper(server, accessToken, {});

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: {},
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("harus mengirimkan comment");
    });

    it("should response 400 when comment not string", async () => {
      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});
      const threadId = await createThreadHelper(server, accessToken, {});

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: {
          content: true,
        },
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("comment harus string");
    });

    it("should response 404 when thread not found", async () => {
      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});
      const threadId = "xxx";

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
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
  });

  describe("when DELETE /comments", () => {
    it("should response 200 and soft delete the comment", async () => {
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
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
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
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { authorization: `Bearer ${wrongToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "anda tidak bisa mengakses resource ini"
      );
    });

    it("should response 404 when comment is not found", async () => {
      const server = await createServer(container);

      await registerUserHelper(server, {});
      const accessToken = await loginUserHelper(server, {});
      const threadId = await createThreadHelper(server, accessToken, {});
      const commentId = "comment-123";

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("comment tidak ditemukan");
    });
  });

  describe("when PUT /comments/likes", () => {
    it("should response 200 and add like to comment", async () => {
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
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
