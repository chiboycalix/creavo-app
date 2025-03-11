import moment from "moment";

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
