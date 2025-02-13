import { formatDistanceToNow, parseISO } from "date-fns";

// Function to categorize a notification based on its timestamp
const categorizeNotification = (
  createdAt: string
): { category: "today" | "thisWeek" | "thisMonth"; time: string } => {
  const notificationDate = parseISO(createdAt);
  const timeDifference = formatDistanceToNow(notificationDate, {
    addSuffix: true,
  });

  const today = new Date().setHours(0, 0, 0, 0);
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);

  if (notificationDate.getTime() >= today)
    return { category: "today", time: timeDifference };
  if (notificationDate >= thisWeek)
    return { category: "thisWeek", time: timeDifference };
  return { category: "thisMonth", time: timeDifference };
};

export const transformNotifications = (notifications: any[]) => {
  const groupedNotifications: {
    today: any[];
    thisWeek: any[];
    thisMonth: any[];
  } = {
    today: [],
    thisWeek: [],
    thisMonth: [],
  };

  // ✅ Step 1: Sort notifications by `createdAt` (latest first)
  const sortedNotifications = notifications?.sort(
    (a, b) =>
      new Date(b.data.createdAt).getTime() -
      new Date(a.data.createdAt).getTime()
  );

  sortedNotifications?.forEach((notification: any) => {
    if (!notification?.data) return;

    const { id, user_, event, createdAt, content } = notification.data;
    const {
      category,
      time,
    }: { category: "today" | "thisWeek" | "thisMonth"; time: string } =
      categorizeNotification(createdAt);

    let action = content;
    let isFollowing = undefined;

    if (event === "FOLLOW") {
      action = "started following you";
      isFollowing = false;
    } else if (event === "LIKE") {
      action = "liked your post";
    }

    // Format notification object
    const formattedNotification = {
      id: id.toString(),
      userImage: user_?.avatar || "/assets/Pupil.png",
      userName: `${user_?.firstName || ""} ${user_?.lastName || ""}`.trim(),
      action,
      timestamp: time,
      ...(isFollowing !== undefined ? { isFollowing } : {}),
    };

    // ✅ Step 2: Add notification to appropriate category
    groupedNotifications[category].push(formattedNotification);
  });

  return groupedNotifications;
};
