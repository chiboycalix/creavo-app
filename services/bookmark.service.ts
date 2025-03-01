import { apiClient } from "@/lib/apiClient";



export const toggleBookmark = async (postId: number): Promise<boolean> => {
  try {
    const response = await apiClient.post("/bookmark", {
      interactableId: postId,
      interactableType: "POST",
    });
    console.log(response)
    return response.data?.statusCode === 201; 
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw error;
  }
};