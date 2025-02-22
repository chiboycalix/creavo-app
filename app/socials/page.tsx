"use client"
import SocialFeed from "@/components/socials/explore/SocialFeed";
import { CommentProvider } from "@/context/CommentsContext";
import { generalHelpers } from "@/helpers";
import { useFetchInfinitePosts } from "@/hooks/posts/useFetchInfinitePosts";

export default function ExplorePage() {
  const { data, isFetching } = useFetchInfinitePosts()

  const result = generalHelpers.processPostsData({
    posts: data?.pages[0]?.data.posts,
    likedStatuses: data?.pages[0]?.data.likedStatuses,
    followStatuses: data?.pages[0]?.data.followStatuses,
  });

  return (
    <CommentProvider
      posts={data?.pages[0]}
    >
      <SocialFeed
        initialPosts={data?.pages[0]}
        result={result}
        isFetcingPosts={isFetching}
      />
    </CommentProvider>
  );
}