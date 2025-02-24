import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GraduationCap, Grip, X } from "lucide-react";
import Item from "./Item";

const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Grip className="text-gray-500" />
      </PopoverTrigger>
      <PopoverContent className="mr-4 mt-8 w-[40rem]">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Quick Actions</h2>
          <button onClick={() => setIsOpen(false)} aria-label="Close popover">
            <X className="text-gray-500 hover:text-gray-700 w-5 h-5" />
          </button>
        </div>

        <div className="mt-10">
          <div className="flex items-start justify-between space-x-4">
            <Item
              title="Create video conference"
              description="Design and easily deploy online teaching software that is custom-branded to your business"
              icon={<GraduationCap className="text-gray-500" />}
              className="basis-1/2"
            />
            <Item
              title="Create a new project"
              description="Design and easily deploy online teaching software that is custom-branded to your business"
              icon={<GraduationCap className="text-gray-500" />}
              className="flex-1"
            />
          </div>

          <div className="flex items-start justify-between space-x-4 mt-8">
            <Item
              title="Upload courses"
              description="Design and easily deploy online teaching software that is custom-branded to your business"
              icon={<GraduationCap className="text-gray-500" />}
              className="basis-1/2"
            />
            <Item
              title="Community"
              description="Design and easily deploy online teaching software that is custom-branded to your business"
              icon={<GraduationCap className="text-gray-500" />}
              className="flex-1"
            />
          </div>

          <div className="flex items-start justify-between space-x-4 mt-8">
            <Item
              title="Upload courses"
              description="Design and easily deploy online teaching software that is custom-branded to your business"
              icon={<GraduationCap className="text-gray-500" />}
              className="basis-1/2"
            />
            <Item
              title="Community"
              description="Design and easily deploy online teaching software that is custom-branded to your business"
              icon={<GraduationCap className="text-gray-500" />}
              className="flex-1"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuickActions;