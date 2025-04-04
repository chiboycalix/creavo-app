"use client";
import React from "react";
import { Plus } from "lucide-react";

const UserAvatarStackSkeleton = ({
  maxVisible = 3,
  itemCount = 3,
}: {
  maxVisible?: number;
  itemCount?: number;
}) => {
  const visibleItems = Math.min(itemCount, maxVisible);
  const additionalCount = itemCount > maxVisible ? itemCount - maxVisible : 0;

  return (
    <div className="flex items-center">
      {Array.from({ length: visibleItems }).map((_, idx) => (
        <div
          className="group relative -mr-4"
          key={idx}
        >
          <div className="relative !m-0 h-10 w-10 rounded-full border-2 border-white bg-gray-200 !p-0" />
        </div>
      ))}

      {additionalCount > 0 && (
        <div className="relative -mr-4 flex items-center">
          <div className="relative h-10 w-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
            <Plus className="h-5 w-5 text-gray-400" />
          </div>
          <span className="ml-2 text-gray-400 font-semibold">+{additionalCount}</span>
        </div>
      )}
    </div>
  );
};

export default UserAvatarStackSkeleton;