import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Input from "../ui/Input";
import Image from "next/image";
import { NotificationGif, ProfileIcon } from "@/public/assets";
import { useWebSocket } from "@/context/WebSocket";
import { NotificationGroup } from "./NotificationGroup";
import { NotificationItem } from "./NotificationItem";
import { transformNotifications } from "./notification";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import { useAuth } from "@/context/AuthContext";

const NotificationsPopover = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();

  const { data } = useUserNotifications(currentUser?.id);

  const ws = useWebSocket();

  const handleNotification = (newNotification: any) => {
    console.log({ newNotification });
    setNotifications((prevNotifications) => {
      if (!Array.isArray(prevNotifications)) return [newNotification];

      const exists = prevNotifications.some(
        (n) => n.data.id === newNotification.data.id
      );

      if (exists) return prevNotifications;

      setHasUnreadNotifications(true); // Set to true when a new notification arrives
      return [...prevNotifications, newNotification];
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (isOpen) {
      setHasUnreadNotifications(false); // Reset the red dot when the popover is opened
    }
  };

  console.log({ notifications });

  useEffect(() => {
    if (ws) {

      ws.on("notification", handleNotification);
      console.log("hiiiii")
      // Cleanup function to remove the event listener when the component unmounts
      // return () => {
      //   ws.off("notification", handleNotification);
      // };
    }
  }, [ws]);

  const groupedNotifications = transformNotifications(notifications);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
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
          <div className="flex-1 flex items-center gap-4 justify-end">
            <div className="">
              <Input
                variant="select"
                className="border border-primary-100"
                placeholder="Select"
                selectSize="small"
                options={[
                  {
                    label: "All",
                    value: "all",
                  },
                ]}
              />
            </div>
            <div className="">
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
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
            {groupedNotifications.today.length > 0 && (
              <NotificationGroup title="Today">
                {groupedNotifications.today.map((notification: any) => (
                  <NotificationItem key={notification.id} {...notification} />
                ))}
              </NotificationGroup>
            )}

            {groupedNotifications.thisWeek.length > 0 && (
              <NotificationGroup title="This Week">
                {groupedNotifications.thisWeek.map((notification: any) => (
                  <NotificationItem key={notification.id} {...notification} />
                ))}
              </NotificationGroup>
            )}

            {groupedNotifications.thisMonth.length > 0 && (
              <NotificationGroup title="This Month">
                {groupedNotifications.thisMonth.map((notification: any) => (
                  <NotificationItem key={notification.id} {...notification} />
                ))}
              </NotificationGroup>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;