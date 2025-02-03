import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const response = await fetch(`${baseUrl}/profiles/${userId}`);
      if (response.status === 404) throw new Error("Profile not found");
      return response.json();
    },
    enabled: !!userId,
  });
}
