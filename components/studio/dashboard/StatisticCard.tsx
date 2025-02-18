"use client";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

type StatisticsCard = {
  title: string;
  count: number;
  icon: any;
};

export const StatisticsCard = ({ title, count, icon }: StatisticsCard) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col justify-between shadow bg-white rounded-md hover:bg-primary cursor-pointer p-4 sm:p-5 lg:p-6 hover:text-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm sm:text-base">{title}</h2>
          {icon}
        </div>
        <h1 className="mt-2 sm:mt-3 lg:mt-4 text-lg sm:text-xl font-semibold">
          {count}
        </h1>
      </div>
      <div className="flex items-center justify-between mt-6 sm:mt-8 lg:mt-10">
        <p className="text-sm sm:text-base flex gap-1 items-center">
          View details <ArrowRight size={15} />
        </p>
      </div>
    </div>
  );
};
