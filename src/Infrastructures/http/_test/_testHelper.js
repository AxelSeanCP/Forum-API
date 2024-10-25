const registerUserHelper = async (
  server,
  {
    username = "dicoding",
    password = "secret",
    fullname = "Dicoding Indonesia",
  }
) => {
  const registerPayload = {
    username,
    password,
    fullname,
  };

  await server.inject({
    method: "POST",
    url: "/users",
    payload: registerPayload,
  });
};

const loginUserHelper = async (
  server,
  { username = "dicoding", password = "secret" }
) => {
  const loginPayload = {
    username,
    password,
  };

  const loginResponse = await server.inject({
    method: "POST",
    url: "/authentications",
    payload: loginPayload,
  });

  const loginResponseJson = JSON.parse(loginResponse.payload);

  return loginResponseJson.data.accessToken;
};

const createThreadHelper = async (
  server,
  accessToken,
  { title = "title", body = "body" }
) => {
  const threadPayload = {
    title,
    body,
  };

  const threadResponse = await server.inject({
    method: "POST",
    url: "/threads",
    payload: threadPayload,
    headers: { authorization: `Bearer ${accessToken}` },
  });

  const threadResponseJson = JSON.parse(threadResponse.payload);
  return threadResponseJson.data.addedThread.id;
};

const createCommentHelper = async (
  server,
  accessToken,
  threadId,
  { content = "a comment" }
) => {
  const commentPayload = {
    content,
  };

  const commentResponse = await server.inject({
    method: "POST",
    url: `/threads/${threadId}/comments`,
    payload: commentPayload,
    headers: { authorization: `Bearer ${accessToken}` },
  });

  const commentResponseJson = JSON.parse(commentResponse.payload);
  return commentResponseJson.data.addedComment.id;
};

const createReplyHelper = async (
  server,
  accessToken,
  threadId,
  commentId,
  { content = "a comment" }
) => {
  const replyPayload = {
    content,
  };

  const replyResponse = await server.inject({
    method: "POST",
    url: `/threads/${threadId}/comments/${commentId}/replies`,
    payload: replyPayload,
    headers: { authorization: `Bearer ${accessToken}` },
  });

  const replyResponseJson = JSON.parse(replyResponse.payload);
  return replyResponseJson.data.addedReply.id;
};

module.exports = {
  registerUserHelper,
  loginUserHelper,
  createThreadHelper,
  createCommentHelper,
  createReplyHelper,
};
