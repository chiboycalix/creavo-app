// import { baseUrl } from "@/utils/constant";
// import React from "react";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Plus, Check } from "lucide-react";

// interface FollowButtonProps {
//   followedId: number | string;
//   avatar: string;
// }

// const FollowButton: React.FC<FollowButtonProps> = ({ followedId, avatar }) => {
//   const { getAuth } = useAuth();
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   // Fetch initial follow status
//   const { data: followStatus, isLoading: isStatusLoading } = useQuery({
//     queryKey: ['followStatus', followedId],
//     queryFn: async () => {
//       if (!getAuth()) return { data: { followed: false } };

//       const response = await fetch(
//         `${baseUrl}/users/${followedId}/follows/status`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${Cookies.get("accessToken")}`,
//           },
//         }
//       );

//       return response.json();
//     },
//     enabled: !!getAuth(),
//   });

//   // Follow mutation
//   const followMutation = useMutation({
//     mutationFn: async () => {
//       if (!getAuth()) {
//         router.push("/auth");
//         return;
//       }

//       const response = await fetch(`${baseUrl}/users/follows`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${Cookies.get("accessToken")}`,
//         },
//         body: JSON.stringify({ userId: followedId }),
//       });

//       if (!response.ok) throw new Error("Failed to follow the user");
//       return response.json();
//     },
//     onMutate: async () => {
//       // Cancel any outgoing refetches
//       await queryClient.cancelQueries({ queryKey: ['followStatus', followedId] });

//       // Snapshot the previous value
//       const previousStatus = queryClient.getQueryData(['followStatus', followedId]);

//       // Optimistically update to the new value
//       queryClient.setQueryData(['followStatus', followedId], {
//         data: { followed: true }
//       });

//       return { previousStatus };
//     },
//     onError: (err, variables, context) => {
//       // If the mutation fails, use the context returned from onMutate to roll back
//       if (context?.previousStatus) {
//         queryClient.setQueryData(['followStatus', followedId], context.previousStatus);
//       }
//     },
//     onSettled: () => {
//       // Always refetch after error or success
//       queryClient.invalidateQueries({ queryKey: ['followStatus', followedId] });
//     }
//   });

//   // Unfollow mutation
//   const unfollowMutation = useMutation({
//     mutationFn: async () => {
//       const response = await fetch(`${baseUrl}/users/${followedId}/unfollow`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${Cookies.get("accessToken")}`,
//         },
//       });

//       if (!response.ok) throw new Error("Failed to unfollow the user");
//       return response.json();
//     },
//     onMutate: async () => {
//       // Cancel any outgoing refetches
//       await queryClient.cancelQueries({ queryKey: ['followStatus', followedId] });

//       // Snapshot the previous value
//       const previousStatus = queryClient.getQueryData(['followStatus', followedId]);

//       // Optimistically update to the new value
//       queryClient.setQueryData(['followStatus', followedId], {
//         data: { followed: false }
//       });

//       return { previousStatus };
//     },
//     onError: (err, variables, context) => {
//       // If the mutation fails, use the context returned from onMutate to roll back
//       if (context?.previousStatus) {
//         queryClient.setQueryData(['followStatus', followedId], context.previousStatus);
//       }
//     },
//     onSettled: () => {
//       // Always refetch after error or success
//       queryClient.invalidateQueries({ queryKey: ['followStatus', followedId] });
//     }
//   });

//   const isLoading =
//     isStatusLoading ||
//     followMutation.isPending ||
//     unfollowMutation.isPending;

//   const isFollowing = followStatus?.data?.followed;

//   const handleToggleFollow = () => {
//     if (isFollowing) {
//       unfollowMutation.mutate();
//     } else {
//       followMutation.mutate();
//     }
//   };

//   return (
//     <div className="relative bg-white border-white border-2 rounded-full flex flex-col items-center justify-center mb-6">
//       <img
//         src={avatar}
//         alt="Post author"
//         className="w-10 h-10 rounded-full"
//       />
//       <button
//         onClick={handleToggleFollow}
//         disabled={isLoading || isFollowing === null}
//         aria-label={
//           isLoading
//             ? "Processing your request"
//             : isFollowing === null
//               ? "Loading follow status"
//               : isFollowing
//                 ? "Unfollow this user"
//                 : "Follow this user"
//         }
//         className="bg-primary-700 absolute -bottom-3 left-2 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 hover:bg-primary-800 disabled:opacity-50"
//       >
//         {isLoading ? (
//           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//         ) : isFollowing ? (
//           <Check className="text-sm text-white w-5 h-5" />
//         ) : (
//           <Plus className="text-sm text-white w-5 h-5" />
//         )}
//       </button>
//     </div>
//   );
// };

// export default FollowButton;

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Check } from "lucide-react";
import { baseUrl } from "@/utils/constant";
interface FollowButtonProps {
  followedId: number | string;
  avatar: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ followedId, avatar }) => {
  const { getAuth } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch initial follow status
  const { data: followStatus } = useQuery({
    queryKey: ['followStatus', followedId],
    queryFn: async () => {
      if (!getAuth()) return { data: { followed: false } };

      const response = await fetch(`${baseUrl}/users/${followedId}/follows/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      return response.json();
    },
    enabled: !!getAuth(),
    staleTime: 1000 * 30, // Refetch only if older than 30 sec
    refetchInterval: 5000, // ✅ Auto-sync every 5 sec
  });

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!getAuth()) {
        router.push("/auth");
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
      return response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['followStatus', followedId] });

      queryClient.setQueryData(['followStatus', followedId], {
        data: { followed: true },
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(['followStatus', followedId], {
        data: { followed: true },
      });
      queryClient.invalidateQueries({ queryKey: ['followStatus', followedId] });
    },
  });

  // Unfollow mutation
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

      queryClient.setQueryData(['followStatus', followedId], {
        data: { followed: false },
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(['followStatus', followedId], {
        data: { followed: false },
      });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['followStatus', followedId] });
      }, 3000); // ✅ Delay re-fetch by 3 seconds
    },
  });

  const isFollowing = followStatus?.data?.followed;

  const handleToggleFollow = () => {
    if (!getAuth()) {
      router.push("/auth?tab=signin"); // Redirect to login page if not authenticated
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
      <img
        src={avatar}
        alt="Post author"
        className="w-10 h-10 rounded-full"
      />
      <button
        onClick={handleToggleFollow}
        aria-label={isFollowing ? "Unfollow this user" : "Follow this user"}
        className="bg-primary-700 absolute -bottom-3 left-2 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 hover:bg-primary-800"
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