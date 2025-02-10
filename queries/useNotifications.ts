import Cookies from "js-cookie";
import { useMutation, useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export const useFetchNotifications = (userId: string, page: number, limit: number) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const response = await fetch(
        `${baseUrl}/users/${userId}/notifications?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return response.json();
    },
    enabled: !!userId,
  });
}

export const useNotificationsReadStatus = (userId: string, notificationId: string) => {
  const readNotification = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${baseUrl}/users/${userId}/notifications/${notificationId}/update-read-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to read notification");
      const result = await response.json();
      return result;
    }
  })

  readNotification.mutate()
}
