import { apiClient } from "@/lib/apiClient";

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
