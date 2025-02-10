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


const fetchNotifications = async () => {
  const response = await fetch('api/notifications');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const NotificationsPopover = () => {
  const [open, setOpen] = React.useState(false);
  const ws = useWebSocket();

  // const { data: notifications, isPending: isLoading, error } = useQuery({
  //   queryKey: ['notifications'],
  //   queryFn: fetchNotifications,
  //   staleTime: 5 * 60 * 1000,
  //   refetchOnWindowFocus: false,
  // });

  const [loading, setLoading] = useState(false)
  const notifications = {
    today: [
      {
        id: '1',
        userImage: "/assets/Pupil.png",
        userName: 'Timothy Edibo',
        action: 'liked your post',
        timestamp: '5mins ago'
      },
      {
        id: '2',
        userImage: "/assets/Pupil.png",
        userName: 'Timothy ademola',
        action: 'started following you',
        timestamp: '15mins ago',
        isFollowing: false
      },
      {
        id: '3',
        userImage: "/assets/Pupil.png",
        userName: 'Timothy ademola',
        action: 'started following you',
        timestamp: '15mins ago',
        isFollowing: false
      }
    ],
    thisWeek: [
      {
        id: '1',
        userImage: "/assets/Pupil.png",
        userName: 'Timothy Edibo',
        action: 'liked your post',
        timestamp: '5mins ago'
      },
      {
        id: '2',
        userImage: "/assets/Pupil.png",
        userName: 'Timothy ademola',
        action: 'started following you',
        timestamp: '15mins ago',
        isFollowing: false
      },
      {
        id: '3',
        userImage: "/assets/Pupil.png",
        userName: 'Timothy ademola',
        action: 'started following you',
        timestamp: '15mins ago',
        isFollowing: false
      }
    ],
    thisMonth: [
      {
        id: '1',
        userImage: "/assets/Pupil.png",
        userName: 'Timothy Edibo',
        action: 'liked your post',
        timestamp: '5mins ago'
      },
      {
        id: '2',
        userImage: "/assets/Pupil.png",
        userName: 'Timothy ademola',
        action: 'started following you',
        timestamp: '15mins ago',
        isFollowing: false
      },
      {
        id: '3',
        userImage: "/assets/Pupil.png",
        userName: 'Timothy ademola',
        action: 'started following you',
        timestamp: '15mins ago',
        isFollowing: false
      },
      {
        id: '4',
        userImage: "/assets/Pupil.png",
        userName: 'Timothy ademola',
        action: 'started following you',
        timestamp: '15mins ago',
        isFollowing: false
      }
    ]
  } as any

  const handleNotification = (data: any) => {
    console.log("Received notification:", data);
  };

  useEffect(() => {
    if (ws) {
      console.log("WebSocket initialized, setting up listeners...");
      ws.on("notification", handleNotification);
    }
  }, [ws]);


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-6 w-6 text-gray-500" />
          {/* {notif?.unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {notif.unreadCount}
            </span>
          )} */}
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
          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
            </div>
          )}

          {/* {error && (
            <div className="text-red-500 text-center py-4">
              Error loading notifications
            </div>
          )} */}

          {notifications?.today?.length === 0 && (
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
            {notifications.today.length > 0 && (
              <NotificationGroup title="Today">
                {notifications.today.map((notification: any) => (
                  <NotificationItem key={notification.id} {...notification} />
                ))}
              </NotificationGroup>
            )}

            {notifications.thisWeek.length > 0 && (
              <NotificationGroup title="This Week">
                {notifications.thisWeek.map((notification: any) => (
                  <NotificationItem key={notification.id} {...notification} />
                ))}
              </NotificationGroup>
            )}

            {notifications.thisMonth.length > 0 && (
              <NotificationGroup title="This Month">
                {notifications.thisMonth.map((notification: any) => (
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