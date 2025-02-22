import React, { useEffect, useState } from "react";
import Image from "next/image";
import NotificationSkeleton from "../sketetons/NotificationSkeleton";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationGif } from "@/public/assets";
import { useWebSocket } from "@/context/WebSocket";
import { NotificationGroup } from "./NotificationGroup";
import { NotificationItem } from "./NotificationItem";
import { transformNotifications } from "./notification";
import { useUserNotifications } from "@/hooks/notifications/useUserNotifications";
import { useAuth } from "@/context/AuthContext";

const NotificationsPopover = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] =
    useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const { data: apiNotifications, isPending: isFetchingNotifications } =
    useUserNotifications(currentUser?.id);

  const ws = useWebSocket();

  const normalizeNotification = (notification: any) => ({
    type: notification.event?.toLowerCase() || "unknown",
    data: {
      id: notification.data?.id || notification.id,
      userId: notification.data?.userId || notification.userId,
      actorId: notification.data?.actorId || notification.actorId,
      event: notification.event || "UNKNOWN",
      resourceType:
        notification.data?.resourceType || notification.resourceType,
      metadata: notification.data?.metadata
        ? JSON.parse(notification.data.metadata)
        : notification.metadata
          ? JSON.parse(notification.metadata)
          : {},
      content: notification.data?.content || notification.content,
      isRead: notification.data?.isRead ?? false,
      createdAt: notification.data?.createdAt || notification.createdAt,
      updatedAt: notification.data?.updatedAt || notification.updatedAt,
      user_username:
        notification.data?.user_username || notification.user_username,
      user_profile_firstName:
        notification.data?.user_profile_firstName ||
        notification.user_profile_firstName,
      user_profile_lastName:
        notification.data?.user_profile_lastName ||
        notification.user_profile_lastName,
      user_profile_avatar:
        notification.data?.user_profile_avatar ||
        notification.user_profile_avatar,
      isFollowing: notification.event === "FOLLOW" ? true : undefined,
    },
  });

  useEffect(() => {
    if (apiNotifications) {
      const formattedNotifications = apiNotifications?.data?.notifications?.map(
        normalizeNotification
      );
      setNotifications(formattedNotifications);
    }
  }, [apiNotifications]);

  // Handle WebSocket notifications
  const handleNotification = (newNotification: any) => {
    console.log({ newNotification })
    const formattedNotification = normalizeNotification(newNotification);

    setNotifications((prevNotifications) => {
      if (!Array.isArray(prevNotifications)) return [formattedNotification];

      const exists = prevNotifications.some(
        (n) => n.data.id === formattedNotification.data.id
      );
      if (exists) return prevNotifications;

      setHasUnreadNotifications(true);
      return [formattedNotification, ...prevNotifications];
    });
  };

  useEffect(() => {
    if (ws) {
      ws.on("notification", handleNotification);
    }

    return () => {
      if (ws) {
        ws.off("notification", handleNotification);
      }
    };
  }, [ws]);

  const groupedNotifications = transformNotifications(notifications);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-6 w-6 text-gray-500" />
          {hasUnreadNotifications && (
            <span className="absolute top-1 right-2.5 bg-red-500 rounded-full w-2 h-2" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[26rem] p-0 mr-4 min-h-[90vh]">
        <div className="flex w-full items-center justify-between p-4 border-b border-gray-100">
          <h3 className="basis-6/12 text-lg font-semibold">Notifications</h3>
        </div>

        <div className="max-h-[80vh] overflow-y-auto">
          {groupedNotifications?.today?.length === 0 && (
            <div className="text-center text-gray-500 py-4 h-full items-center justify-center flex flex-col mt-28">
              <Image
                src={NotificationGif}
                alt="NotificationGif"
                className="w-32"
              />
              <p>There are no notifications at the moment.</p>
            </div>
          )}

          <div className="min-h-[80vh] overflow-y-auto">
            {isFetchingNotifications ? (
              <NotificationSkeleton />
            ) : (
              groupedNotifications.today.length > 0 && (
                <NotificationGroup title="Today">
                  {groupedNotifications.today.map((notification: any) => (
                    <NotificationItem
                      key={notification?.id}
                      {...notification}
                    />
                  ))}
                </NotificationGroup>
              )
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
