interface GeneralHelpers {
  convertToSlug: (sentence: string) => string;
  convertFromSlug: (slug: string) => string;
  processPostsData: (data: any) => any;
  capitalizeWords: (sentence: string) => string;
  findCorrectOptionIndex: (options: any) => number;
  currencySymbols: {
    USD: string;
    EUR: string;
    GBP: string;
    JPY: string;
    CAD: string;
    AUD: string;
    CHF: string;
    CNY: string;
    SEK: string;
    NZD: string;
    NGN: string;
  };
  getCurrencySymbol: (
    currencyCode: keyof GeneralHelpers["currencySymbols"]
  ) => string;
}

export const generalHelpers: GeneralHelpers = {
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
    const { posts, likedStatuses, followStatuses, bookmarkStatuses } = data;
    const likesMap = new Map(
      likedStatuses?.map((status: any) => [status?.postId, status?.liked])
    );

    const bookmarkMap = new Map(
      bookmarkStatuses?.map((status: any) => [
        status?.postId,
        status?.bookmarked,
      ])
    );

    const followsMap = new Map(
      followStatuses?.map((status: any) => [status?.userId, status?.followed])
    );

    return posts?.map((post: any) => ({
      ...post,
      liked: likesMap.get(post.id) ?? false,
      followed: followsMap.get(post.userId) ?? false,
      bookmarked: bookmarkMap.get(post.id) ?? false,
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

  currencySymbols: {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "C$",
    AUD: "A$",
    CHF: "CHF",
    CNY: "¥",
    SEK: "kr",
    NZD: "NZ$",
    NGN: "₦",
  } as const,

  getCurrencySymbol: (
    currencyCode: keyof typeof generalHelpers.currencySymbols
  ): string => {
    return generalHelpers.currencySymbols[currencyCode] || currencyCode;
  },

  findCorrectOptionIndex: (
    options: { isCorrect: boolean; text: string; _id: string }[]
  ): number => {
    return options.findIndex((option) => option.isCorrect === true);
  },
};
