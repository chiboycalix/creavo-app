import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Input from '../ui/Input';
import Image from 'next/image';
import { NotificationGif, ProfileIcon } from '@/public/assets';
import { useWebSocket } from '@/context/WebSocket';
import { NotificationGroup } from './NotificationGroup';
import { NotificationItem } from './NotificationItem';
import { transformNotifications } from './notification';


const fetchNotifications = async () => {
  const response = await fetch('api/notifications');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const NotificationsPopover = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);


  const ws = useWebSocket();

  // const { data: notifications, isPending: isLoading, error } = useQuery({
  //   queryKey: ['notifications'],
  //   queryFn: fetchNotifications,
  //   staleTime: 5 * 60 * 1000,
  //   refetchOnWindowFocus: false,
  // });

  const handleNotification = (newNotification: any) => {
    console.log({ newNotification })
    setNotifications((prevNotifications) => {
      if (!Array.isArray(prevNotifications)) return [newNotification];

      const exists = prevNotifications.some((n) => n.data.id === newNotification.data.id);

      if (exists) return prevNotifications;

      return [...prevNotifications, newNotification];
    });

    setUnreadCount((prev) => prev + 1);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (isOpen) {
      setUnreadCount(0);
    }
  };

  console.log({ notifications })

  useEffect(() => {
    if (ws) {
      ws.on("notification", handleNotification);
    }
  }, [ws]);

  const groupedNotifications = transformNotifications(notifications);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-6 w-6 text-gray-500" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>


      <PopoverContent className="w-[26rem] p-0 mr-4 min-h-[90vh]">
        <div className="flex w-full items-center justify-between p-4 border-b border-gray-100">
          <h3 className="basis-6/12 text-lg font-semibold">Notifications</h3>
          <div className='flex-1 flex items-center gap-4 justify-end'>
            <div className=''>
              <Input
                variant='select'
                className='border border-primary-100'
                placeholder='Select'
                selectSize='small'
                options={[
                  {
                    label: "All",
                    value: "all"
                  }
                ]}
              />
            </div>
            <div className=''>
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
          {/* <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
            </div> */}

          {/* {error && (
            <div className="text-red-500 text-center py-4">
              Error loading notifications
            </div>
          )} */}

          {groupedNotifications?.today?.length === 0 && (
            <div className="text-center text-gray-500 py-4 h-full items-center justify-center flex flex-col mt-28">
              <Image
                src={NotificationGif}
                alt='NotificationGif'
                className='w-32'
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
