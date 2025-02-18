import React from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Check } from "lucide-react";
import { baseUrl } from "@/utils/constant";
import { useWebSocket } from "@/context/WebSocket";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

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

  const { data: followStatus } = useQuery({
    queryKey: ['followStatus', followedId],
    queryFn: async () => {
      if (!getAuth()) return { data: { followed: initialFollowStatus } };

      const response = await fetch(`${baseUrl}/users/${followedId}/follows/status`, {
        headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch follow status");
      return response.json();
    },
    enabled: !!getAuth(),
    staleTime: 0,
    initialData: { data: { followed: initialFollowStatus } },
  });

  const isFollowing = followStatus?.data?.followed ?? initialFollowStatus;

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
      await queryClient.cancelQueries({ queryKey: ['followStatus', followedId] });

      queryClient.setQueryData(['followStatus', followedId], { data: { followed: true } });

      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.userId === followedId ? { ...post, followed: true } : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });
    },
    onError: () => {
      queryClient.setQueryData(['followStatus', followedId], { data: { followed: false } });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', followedId] });
    },
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
      await queryClient.cancelQueries({ queryKey: ['followStatus', followedId] });
      queryClient.setQueryData(['followStatus', followedId], { data: { followed: false } });
      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.userId === followedId ? { ...post, followed: false } : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });
    },
    onError: () => {
      queryClient.setQueryData(['followStatus', followedId], { data: { followed: true } });
    },
    onSettled: () => {
      queryClient.setQueryData(['followStatus', followedId], { data: { followed: false } });
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
        <AvatarImage src={avatar} alt="Post author avatar" />
        <AvatarFallback>.</AvatarFallback>
      </Avatar>

      <button
        onClick={handleToggleFollow}
        aria-label={isFollowing ? "Unfollow this user" : "Follow this user"}
        className="bg-primary-700 absolute -bottom-3 left-3 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 hover:bg-primary-800"
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