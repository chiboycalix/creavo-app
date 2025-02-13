// import React from "react";
// import Cookies from "js-cookie";
// import { Heart } from "lucide-react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { baseUrl } from "@/utils/constant";

// interface Post {
//   id: number;
//   likesCount: number;
//   isLiked: boolean;
// }

// interface LikeButtonProps {
//   postId: number;
//   initialLikesCount: number;
//   initialIsLiked: boolean;
// }

// const LikeButton: React.FC<LikeButtonProps> = ({
//   postId,
//   initialLikesCount,
//   initialIsLiked
// }) => {
//   const queryClient = useQueryClient();
//   const { getAuth } = useAuth();
//   const router = useRouter();

//   const { data: post } = useQuery<Post>({
//     queryKey: ["post", postId],
//     queryFn: async () => {
//       return {
//         id: postId,
//         likesCount: initialLikesCount,
//         isLiked: initialIsLiked
//       };
//     },
//     initialData: {
//       id: postId,
//       likesCount: initialLikesCount,
//       isLiked: initialIsLiked
//     },
//     staleTime: Infinity,
//     gcTime: Infinity,
//   });

//   const toggleMutation = useMutation({
//     mutationFn: async () => {
//       const response = await fetch(`${baseUrl}/posts/${postId}/toggle-like`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${Cookies.get("accessToken")}`,
//         },
//       });

//       if (!response.ok) throw new Error("Failed to toggle like");
//       return response.json();
//     },
//     onMutate: async () => {
//       await queryClient.cancelQueries({ queryKey: ["post", postId] });
//       const previousPost = queryClient.getQueryData<Post>(["post", postId]);

//       if (previousPost) {
//         const newPost = {
//           ...previousPost,
//           isLiked: !previousPost.isLiked,
//           likesCount: previousPost.likesCount + (previousPost.isLiked ? -1 : 1)
//         };
//         queryClient.setQueryData(["post", postId], newPost);
//       }

//       return { previousPost };
//     },
//     onError: (_, __, context) => {
//       if (context?.previousPost) {
//         queryClient.setQueryData(["post", postId], context.previousPost);
//       }
//     },
//     onSuccess: () => {
//       const currentPost = queryClient.getQueryData<Post>(["post", postId]);
//       if (currentPost) {
//         queryClient.setQueryData(["post", postId], {
//           ...currentPost,
//           isLiked: currentPost.isLiked
//         });
//       }
//     }
//   });

//   const handleLikeClick = () => {
//     if (!getAuth()) {
//       router.push("/auth?tab=signin");
//       return;
//     }
//     toggleMutation.mutate();
//   };
//   // console.log({ post })
//   return (
//     <div className="flex flex-col items-center gap-2">
//       <button
//         onClick={handleLikeClick}
//         disabled={toggleMutation.isPending}
//         className="flex items-center focus:outline-none transition-opacity disabled:opacity-50"
//         aria-label={post.isLiked ? "Unlike post" : "Like post"}
//       >
//         <Heart
//           className={`w-6 h-6 transition-colors duration-200 ${post.isLiked
//             ? "fill-red-500 stroke-red-500"
//             : "md:hover:stroke-red-500 stroke-gray-500"
//             }`}
//         />
//       </button>
//       <span className="text-xs font-semibold">
//         {post.likesCount.toLocaleString()}
//       </span>
//     </div>
//   );
// };

// export default LikeButton;

import React from "react";
import Cookies from "js-cookie";
import { Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/utils/constant";
import { useWebSocket } from "@/context/WebSocket";

interface Post {
  id: number;
  likesCount: number;
  isLiked: boolean;
}

interface LikeButtonProps {
  postId: number;
  initialLikesCount: number;
  initialIsLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLikesCount,
  initialIsLiked,
}) => {
  const queryClient = useQueryClient();
  const { getAuth, getCurrentUser } = useAuth();
  const router = useRouter();
  const ws = useWebSocket();
  const currentUser = getCurrentUser()
  const { data: post } = useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: async () => {
      return {
        id: postId,
        likesCount: initialLikesCount,
        isLiked: initialIsLiked,
      };
    },
    initialData: {
      id: postId,
      likesCount: initialLikesCount,
      isLiked: initialIsLiked,
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${baseUrl}/posts/${postId}/toggle-like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to toggle like");
      return response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      const previousPost = queryClient.getQueryData<Post>(["post", postId]);

      if (previousPost) {
        const newPost = {
          ...previousPost,
          isLiked: !previousPost.isLiked,
          likesCount: previousPost.likesCount + (previousPost.isLiked ? -1 : 1),
        };
        queryClient.setQueryData(["post", postId], newPost);
      }

      return { previousPost };
    },
    onError: (_, __, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
    },
    onSuccess: (data) => {
      const currentPost = queryClient.getQueryData<Post>(["post", postId]);
      if (currentPost) {
        queryClient.setQueryData(["post", postId], {
          ...currentPost,
          isLiked: currentPost.isLiked,
        });
      }

      // Emit WebSocket event based on the new state
      if (ws && ws.connected && currentPost?.isLiked) {
        console.log({ data }, "noonooo")
        const eventType = currentPost?.isLiked ? "like" : "unlike";
        const request = {
          userId: data?.data?.userId, // Current user's ID
          notificationId: data.data.id, // Assuming the response contains the notification ID
        };
        console.log({ request })
        ws.emit("like", request);
      }
    },
  });

  const handleLikeClick = () => {
    if (!currentUser) {
      router.push("/auth?tab=signin");
      return;
    }
    toggleMutation.mutate();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleLikeClick}
        disabled={toggleMutation.isPending}
        className="flex items-center focus:outline-none transition-opacity disabled:opacity-50"
        aria-label={post.isLiked ? "Unlike post" : "Like post"}
      >
        <Heart
          className={`w-6 h-6 transition-colors duration-200 ${post.isLiked
            ? "fill-red-500 stroke-red-500"
            : "md:hover:stroke-red-500 stroke-gray-500"
            }`}
        />
      </button>
      <span className="text-xs font-semibold">
        {post.likesCount.toLocaleString()}
      </span>
    </div>
  );
};

export default LikeButton;