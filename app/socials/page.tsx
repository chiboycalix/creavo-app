"use client"
import SocialFeed from "@/components/socials/explore/SocialFeed";
import { CommentProvider } from "@/context/CommentsContext";
import { generalHelpers } from "@/helpers";
import { useFetchInfinitePosts } from "@/hooks/posts/useFetchInfinitePosts";

export default function ExplorePage() {
  const { data, isFetching } = useFetchInfinitePosts()

  return (
    <CommentProvider
      posts={data?.pages[0]}
    >
      <SocialFeed
        initialPosts={data?.pages[0]}
        isFetcingPosts={isFetching}
      />
    </CommentProvider>
  );
}