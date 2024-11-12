const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");
const ToggleCommentLikeUseCase = require("../../../../Applications/use_case/ToggleCommentLikeUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.toggleCommentLikeHandler = this.toggleCommentLikeHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const { id: userId } = request.auth.credentials;
    const { id: threadId } = request.params;
    const addedComment = await addCommentUseCase.execute(
      userId,
      threadId,
      request.payload
    );

    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    const { id: userId } = request.auth.credentials;
    const { commentId } = request.params;

    await deleteCommentUseCase.execute(commentId, userId);
    return {
      status: "success",
    };
  }

  async toggleCommentLikeHandler(request) {
    const toggleCommentLikeUseCase = this._container.getInstance(
      ToggleCommentLikeUseCase.name
    );

    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await toggleCommentLikeUseCase.execute(userId, commentId, threadId);
    return {
      status: "success",
    };
  }
}

module.exports = CommentsHandler;
