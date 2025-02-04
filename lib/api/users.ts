import Cookies from "js-cookie";
import { baseUrl } from "@/utils/constant";
import { apiClient } from "../apiClient";

export const fetchFollowings = async (userId: string) => {
  const response = await apiClient.get(
    `${baseUrl}/users/${userId}/followings?page=1&limit=20`
  );
  return response.data;
};

export const fetchFollowers = async (userId: string) => {
  const response = await apiClient.get(
    `${baseUrl}/users/${userId}/followers?page=1&limit=20`
  );
  return response.data;
};

export const sendInvites = async ({
  externalParticipant,
  internalParticipant,
  roomCode,
}: {
  externalParticipant: string[];
  internalParticipant: string[];
  roomCode: string;
}) => {
  const token = Cookies.get("accessToken");
  const response = await fetch(`${baseUrl}/rooms/invite-participant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      externalParticipant,
      internalParticipant,
      roomCode,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send invites");
  }

  return response.json();
};
