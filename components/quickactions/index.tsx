import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  GraduationCap,
  Grip,
  X,
  ChartLine,
  LayoutDashboard,
  CalendarDays,
  Video,
} from "lucide-react";
import Item from "./Item";
import Image from "next/image";

const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Grip className="text-gray-500" />
      </PopoverTrigger>
      <PopoverContent className="mr-2 mt-11 w-[40rem]">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Quick Actions</h2>
          <button onClick={() => setIsOpen(false)} aria-label="Close popover">
            <X className="text-gray-500 hover:text-gray-700 w-5 h-5" />
          </button>
        </div>

        <div className="mt-10">
          <div className="flex items-start justify-between space-x-4">
            <Item
              link="/studio/course"
              title="Create Course"
              description="Build and customize your online course with ease. Upload content, set pricing, and engage with learners."
              icon={
                <Image
                  src="/assets/createsvg.svg"
                  width={70}
                  height={70}
                  alt={"ShortCourse"}
                  className="rounded-full"
                />
              }
              className="basis-1/2 "
            />
            <Item
              link="#"
              title="Create Listing"
              description="Showcase your products or services in a few simple steps. Reach potential buyers effortlessly."
              icon={
                <Image
                  src="/assets/createsvg2.svg"
                  width={70}
                  height={70}
                  alt={"ShortCourse"}
                  className="rounded-full"
                />
              }
              className="flex-1"
            />
          </div>

          <div className="flex items-start justify-between space-x-4 mt-8">
            <Item
              link="/studio/analytics/overview"
              title="Analytics"
              description="Gain insights into your performance with real-time data on sales, engagement, and trends."
              icon={<ChartLine className="text-[#0073B4] " />}
              className="basis-1/2"
            />
            <Item
              link="/market/seller-dashboard"
              title="Seller's Dashboard"
              description="Manage your store, track orders, and optimize sales—all in one place."
              icon={<LayoutDashboard className="text-[#0073B4] " />}
              className="flex-1"
            />
          </div>

          <div className="flex items-start justify-between space-x-4 mt-8">
            <Item
              link="/studio/calendar"
              title="Calendar"
              description="Stay organized with scheduled events, appointments, and reminders at a glance."
              icon={<CalendarDays className="text-[#0073B4]" />}
              className="basis-1/2"
            />
            <Item
              link="/studio/event/meeting"
              title="Video Conferencing"
              description="Connect and collaborate in real time with high-quality video and seamless communication."
              icon={<Video className="text-[#0073B4] " />}
              className="flex-1"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuickActions;
