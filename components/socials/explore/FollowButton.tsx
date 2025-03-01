import React from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Check } from "lucide-react";
import { baseUrl } from "@/utils/constant";
import { useWebSocket } from "@/context/WebSocket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FollowButtonProps {
  followedId: number | string;
  avatar: string;
  initialFollowStatus?: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  followedId,
  avatar,
  initialFollowStatus = false,
}) => {
  const queryClient = useQueryClient();
  const { getAuth } = useAuth();
  const router = useRouter();
  const ws = useWebSocket();

  const [isFollowing, setIsFollowing] = React.useState(initialFollowStatus);

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!getAuth()) {
        router.push("/auth?tab=signin");
        return;
      }

      const response = await fetch(`${baseUrl}/users/follows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify({ userId: followedId }),
      });

      if (!response.ok) throw new Error("Failed to follow the user");
      const result = await response.json();

      if (ws && ws.connected) {
        const request = { userId: followedId, notificationId: result?.data?.id };
        ws.emit("follow", request);
      } else {
        console.log("Failed to follow user", followedId);
      }

      return result;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["user-followers"] });
      await queryClient.cancelQueries({ queryKey: ["infinite-posts"] });

      const previousFollowersData = queryClient.getQueryData(["user-followers", followedId]);
      queryClient.setQueryData(["user-followers", followedId], (oldData: any) => {
        if (!oldData?.pages) return oldData;
        const updatedPages = oldData.pages.map((page: any) => ({
          ...page,
          followers: page.followers.map((follower: any) =>
            follower.userId === followedId ? { ...follower, followed: true } : follower
          ),
        }));
        return { ...oldData, pages: updatedPages };
      });

      // Optimistically update posts data
      const previousPostsData = queryClient.getQueryData(["infinite-posts"]);
      queryClient.setQueryData(["infinite-posts"], (oldData: any) => {
        if (!oldData?.pages) return oldData;
        const updatedPages = oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: any) =>
            post.userId === followedId ? { ...post, followed: true } : post
          ),
        }));
        return { ...oldData, pages: updatedPages };
      });

      // Update local state
      setIsFollowing(true);

      return { previousFollowersData, previousPostsData };
    },
    onError: (err, _, context) => {
      // Revert on error
      queryClient.setQueryData(["user-followers", followedId], context?.previousFollowersData);
      queryClient.setQueryData(["infinite-posts"], context?.previousPostsData);
      setIsFollowing(initialFollowStatus);
    },
    // No onSettled invalidation to prevent refetch
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${baseUrl}/users/${followedId}/unfollow`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to unfollow the user");
      return response.json();
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user-followers"] });
      await queryClient.cancelQueries({ queryKey: ["infinite-posts"] });

      // Optimistically update followers data
      const previousFollowersData = queryClient.getQueryData(["user-followers", followedId]);
      queryClient.setQueryData(["user-followers", followedId], (oldData: any) => {
        if (!oldData?.pages) return oldData;
        const updatedPages = oldData.pages.map((page: any) => ({
          ...page,
          followers: page.followers.map((follower: any) =>
            follower.userId === followedId ? { ...follower, followed: false } : follower
          ),
        }));
        return { ...oldData, pages: updatedPages };
      });

      // Optimistically update posts data
      const previousPostsData = queryClient.getQueryData(["infinite-posts"]);
      queryClient.setQueryData(["infinite-posts"], (oldData: any) => {
        if (!oldData?.pages) return oldData;
        const updatedPages = oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: any) =>
            post.userId === followedId ? { ...post, followed: false } : post
          ),
        }));
        return { ...oldData, pages: updatedPages };
      });

      setIsFollowing(false);

      return { previousFollowersData, previousPostsData };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["user-followers", followedId], context?.previousFollowersData);
      queryClient.setQueryData(["infinite-posts"], context?.previousPostsData);
      setIsFollowing(initialFollowStatus);
    },
  });

  const handleToggleFollow = () => {
    if (!getAuth()) {
      router.push("/auth?tab=signin");
      return;
    }

    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return (
    <div className="relative bg-white border-white border-2 rounded-full flex flex-col items-center justify-center mb-6">
      <Avatar className="w-12 h-12">
        <AvatarImage src={avatar} alt="User avatar" />
        <AvatarFallback>.</AvatarFallback>
      </Avatar>

      <button
        onClick={handleToggleFollow}
        aria-label={isFollowing ? "Unfollow this user" : "Follow this user"}
        disabled={followMutation.isPending || unfollowMutation.isPending}
        className="bg-primary-700 absolute -bottom-3 left-3 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 hover:bg-primary-800 disabled:opacity-50"
      >
        {isFollowing ? (
          <Check className="text-sm text-white w-5 h-5" />
        ) : (
          <Plus className="text-sm text-white w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default FollowButton;