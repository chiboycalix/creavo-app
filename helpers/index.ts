export const generalHelpers = {
  convertToSlug: (sentence: string) => {
    return sentence
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-");
  },
  convertFromSlug: (slug: string) => {
    return slug
      .replace(/-/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  },

  processPostsData: (data: any) => {
    const { posts, likedStatuses, followStatuses } = data;

    // Create lookup maps for faster access
    const likesMap = new Map(
      likedStatuses?.map((status: any) => [status?.postId, status?.liked])
    );

    const followsMap = new Map(
      followStatuses?.map((status: any) => [status?.userId, status?.followed])
    );

    // Map over posts and add liked and followed properties
    return posts?.map((post: any) => ({
      ...post,
      liked: likesMap.get(post.id) ?? false,
      followed: followsMap.get(post.userId) ?? false
    }));
  }
};
