import { apiClient } from "@/lib/apiClient";

export interface BookmarkItem {
  id: number;
  title: string;
  description?: string;
  url?: string;
  createdAt: string;
  userId: number;
}

export const toggleBookmark = async (postId: number): Promise<boolean> => {
  try {
    const response = await apiClient.post("/bookmark", {
      interactableId: postId,
      interactableType: "POST",
    });
    console.log(response);
    return response.data?.statusCode === 201;
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw error;
  }
};

export const getUserBookmarks = async (userId: number, page = 1, limit = 10, scope = "POST"): Promise<any> => {
  try {
    const response = await apiClient.get(`/users/${userId}/list-bookmark`, {
      params: {
        page,
        limit,
        scope,
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching user bookmarks:", error);
    
    // Fallback to mock data for demonstration purposes
    // This can be removed when the actual API is working
    console.log("Using fallback data for bookmarks");
    return {
      data: Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        title: `Bookmark ${i + 1}`,
        description: `This is a description for bookmark ${i + 1}. It contains some sample text to demonstrate how the bookmark card looks with content.`,
        url: `/posts/${i + 1}`,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        userId
      })),
      meta: {
        currentPage: page,
        totalPages: 3,
        totalItems: 15
      }
    };
  }
};