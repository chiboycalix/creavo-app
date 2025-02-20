"use client"
import SocialFeed from "@/components/socials/explore/SocialFeed";
import { CommentProvider } from "@/context/CommentsContext";
import { generalHelpers } from "@/helpers";
import { useFetchPosts } from "@/hooks/useFetchPosts";

export default function ExplorePage() {
  const { data: posts, isPending: isFetcingPosts } = useFetchPosts()

  const result = generalHelpers.processPostsData({
    posts: posts?.data.posts,
    likedStatuses: posts?.data.likedStatuses,
    followStatuses: posts?.data.followStatuses
  });

  return (
    <CommentProvider
      posts={posts}
    >
      <SocialFeed
        posts={posts}
        result={result}
        isFetcingPosts={isFetcingPosts}
      />
    </CommentProvider>
  );
}