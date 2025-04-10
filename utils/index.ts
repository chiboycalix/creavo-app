import moment from "moment";
import { cloudinaryCloudName, cloudinaryUploadPreset } from "@/utils/constant";
import { Message } from "@/types/chat";
export interface RawMessage {
  _id: string;
  uId: string;
  rUid: string;
  roomId: string;
  mId: string;
  text: string;
  imageUrl: string | null;
  date: string;
}

export const formatDate = (dateString: string): string => {
  const now = new Date();
  const postDate = new Date(dateString);
  const differenceInMs = now.getTime() - postDate.getTime();

  const msInDay = 24 * 60 * 60 * 1000;
  const msInMonth = msInDay * 30;
  const msInYear = msInDay * 365;

  const daysAgo = Math.floor(differenceInMs / msInDay);
  const monthsAgo = Math.floor(differenceInMs / msInMonth);
  const yearsAgo = Math.floor(differenceInMs / msInYear);

  if (yearsAgo > 0) {
    return yearsAgo === 1 ? "1 year ago" : `${yearsAgo} years ago`;
  } else if (monthsAgo > 0) {
    return monthsAgo === 1 ? "1 month ago" : `${monthsAgo} months ago`;
  } else if (daysAgo > 0) {
    return daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`;
  } else {
    return "Today";
  }
};

export const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} Bytes`;
  else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  else if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  else return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export const formatCommentDate = (date: string): string => {
  const now = moment();
  const commentTime = moment(date);
  const diffInSeconds = now.diff(commentTime, "seconds");
  const diffInWeeks = now.diff(commentTime, "weeks");

  if (diffInWeeks >= 1) {
    return commentTime.format("YYYY-MM-DD");
  }

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  const diffInMinutes = now.diff(commentTime, "minutes");
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = now.diff(commentTime, "hours");
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = now.diff(commentTime, "days");
  return `${diffInDays}d ago`;
};

export function getMimeTypeFromCloudinaryUrl(url: string): string | null {
  try {
    const urlParts = url?.split(/[#?]/)[0];
    const extensionMatch = urlParts?.match(/\.([a-zA-Z0-9]+)$/);
    const extension = extensionMatch ? extensionMatch[1]?.toLowerCase() : null;
    if (!extension) {
      if (url?.includes("/video/")) return "video/mp4";
      if (url?.includes("/image/")) return "image/jpeg";
      return null;
    }

    const mimeTypes: { [key: string]: string } = {
      mp4: "video/*",
      mov: "video/*",
      flv: "video/*",
      webm: "video/*",
      jpg: "image/*",
      jpeg: "image/*",
      png: "image/*",
      gif: "image/*",
      webp: "image/*",
      avif: "image/*",
    };

    return mimeTypes[extension] || null;
  } catch (error) {
    console.error("Error parsing MIME type from URL:", error);
    return null;
  }
}

export async function getMediaDimensionsClientSide(url: string): Promise<{
  width: number;
  height: number;
  type: "video" | "image" | "unknown";
}> {
  return new Promise((resolve) => {
    if (url.includes("/video/")) {
      const video = document.createElement("video");
      video.src = url;
      video.onloadedmetadata = () => {
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          type: "video",
        });
        video.remove();
      };
      video.onerror = () => {
        resolve({ width: 0, height: 0, type: "unknown" });
        video.remove();
      };
    } else {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          type: "image",
        });
        img.remove();
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0, type: "unknown" });
        img.remove();
      };
    }
  });
}

export const uploadImageToCloudinary = async (
  avatar: File
): Promise<string | undefined> => {
  try {
    const data = new FormData();
    data.append("file", avatar);
    data.append("upload_preset", cloudinaryUploadPreset as string);
    data.append("cloud_name", cloudinaryCloudName as string);
    data.append("folder", "Crevoe/profile-images");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`,
      { method: "POST", body: data }
    );

    if (!response.ok) throw new Error("Failed to upload image");

    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    throw error;
  }
};

export const transformAndGroupMessages = (
  rawMessages: RawMessage[],
  profileData: any
): Message[] => {
  const groupedByDate: { [key: string]: RawMessage[] } = {};

  rawMessages?.forEach((msg) => {
    const dateKey = new Date(msg.date).toISOString().split("T")[0];
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(msg);
  });

  const transformedMessages: Message[] = [];
  Object.entries(groupedByDate)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .forEach(([date, messages]) => {
      transformedMessages.push({
        id: `date-${date}`,
        content: "",
        timestamp: date,
        user: { name: "", avatar: "" },
        reactions: { likes: 0, loves: 0 },
        date: new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });

      messages
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .forEach((msg) => {
          transformedMessages.push({
            id: msg._id,
            content: msg.text,
            image: msg.imageUrl,
            timestamp: new Date(msg.date).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            user: {
              name: `${profileData?.firstName} ${profileData?.lastName}`,
              avatar: `${profileData?.avatar}`,
            },
            reactions: { likes: 0, loves: 0 },
          });
        });
    });

  return transformedMessages;
};
