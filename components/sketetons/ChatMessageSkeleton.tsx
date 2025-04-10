import React from "react";
import { cn } from "@/lib/utils";

const ChatMessageSkeleton: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Optional Date Header */}
      {Math.random() > 0.7 && ( // Randomly show date header ~30% of the time to mimic real data
        <div className="flex justify-center my-6">
          <div className="skeleton h-6 w-32 rounded-full"></div>
        </div>
      )}
      <div className="flex gap-3 mb-6">
        {/* Avatar */}
        <div className={cn("rounded-full overflow-hidden h-10 w-10 flex-shrink-0")}>
          <div className="skeleton h-full w-full"></div>
        </div>
        <div className="flex-1">
          {/* Header: Name and Timestamp */}
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="skeleton h-5 w-24 rounded"></div> {/* Name */}
              <div className="skeleton h-3 w-16 rounded"></div> {/* Timestamp */}
            </div>
            <div className="skeleton h-6 w-6 rounded-full"></div> {/* MoreVertical button */}
          </div>

          {/* Content */}
          <div className="mt-2 space-y-3">
            <div className="skeleton h-4 w-3/4 rounded"></div> {/* Text */}
            {Math.random() > 0.5 && ( // Randomly show image ~50% of the time
              <div className="skeleton h-32 w-48 rounded-lg"></div> /* Image */
            )}
          </div>

          {/* Reaction Buttons */}
          <div className="flex mt-3 gap-2">
            <div className="skeleton h-8 w-16 rounded-full"></div> {/* Likes */}
            <div className="skeleton h-8 w-16 rounded-full"></div> {/* Loves */}
            <div className="skeleton h-8 w-20 rounded-full"></div> {/* Comment */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageSkeleton;