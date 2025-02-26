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
    const likesMap = new Map(
      likedStatuses?.map((status: any) => [status?.postId, status?.liked])
    );

    const followsMap = new Map(
      followStatuses?.map((status: any) => [status?.userId, status?.followed])
    );

    return posts?.map((post: any) => ({
      ...post,
      liked: likesMap.get(post.id) ?? false,
      followed: followsMap.get(post.userId) ?? false,
    }));
  },

  capitalizeWords(sentence: string) {
    if (!sentence || typeof sentence !== "string") {
      return sentence;
    }

    return sentence
      .split(" ")
      .map((word) => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  },
};
