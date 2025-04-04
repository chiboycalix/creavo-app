import { color } from "framer-motion";
import { apiClient } from "../apiClient";

type Meeting = {
  code: number;
  statusCode: number;
  status: string;
  data: {
    meetingCode: string;
    startTime: string;
    userId: number;
  };
};
export const MEETINGS_API = {
  createInstantMeeting: async (): Promise<Meeting> => {
    return apiClient.post("/meetings", {
      type: "INSTANT",
      startTime: new Date().toISOString(),
    });
  },
};
