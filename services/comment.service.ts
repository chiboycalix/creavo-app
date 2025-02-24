import { apiClient } from "@/lib/apiClient";
import { CommentPayload } from "@/types";

export type DeleteCommentPayload = {
  postId: number;
  commentId: number;
};

export const addCommentService = async (payload: CommentPayload) => {
  try {
    const { data } = await apiClient.post(
      `/posts/${payload?.postId}/create-comment`,
      {
        body: payload?.comment,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const replyCommentService = async (payload: CommentPayload) => {
  console.log({ payload });
  try {
    const { data } = await apiClient.post(
      `/posts/${payload?.postId}/create-comment`,
      {
        body: payload?.comment,
        commentId: payload?.commentId,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteCommentService = async (payload: DeleteCommentPayload) => {
  try {
    const { data } = await apiClient.delete(
      `/posts/${payload?.postId}/comments/${payload?.commentId}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
