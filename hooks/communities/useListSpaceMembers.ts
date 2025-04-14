import { baseUrl } from "@/utils/constant";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

export function useListSpaceMembers(
  communityId: string | undefined,
  spaceId: string | undefined
) {
  const token = Cookies.get("accessToken");
  console.log({ token });
  return useQuery({
    queryKey: ["spaceId-communityId", communityId, spaceId],
    queryFn: async () => {
      if (!communityId || !spaceId)
        throw new Error("communityId and spaceId is required");
      const response = await fetch(
        `${baseUrl}/communities/${communityId}/spaces/${spaceId}/members?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return response.json();
    },
    enabled: !!communityId || !!spaceId,
  });
}
