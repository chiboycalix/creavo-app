import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { generalHelpers } from "@/helpers";
import { Thumbnail } from "@/public/assets";
import { getMimeTypeFromCloudinaryUrl } from "@/utils";

type Course = {
  id: number;
  userId: number;
  difficultyLevel: "beginner" | "intermediate" | "hard";
  currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NZD" | "NGN";
  amount: number | null;
  isPaid: boolean;
  promotionalUrl: string;
  promote: boolean;
  tags: string[];
  title: string;
  category: "SIMPLE" | "STANDARD"; // Add other categories if applicable
  description: string;
  metadata: any | null; // Adjust type if metadata has a known structure
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  sharesCount: number;
  bookmarkCount: number;
  totalWatchTime: number;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string; // Consider using Date if parsing is needed
  updatedAt: string;
};

const Playlist = ({ course }: { value: number; course: Course }) => {
  const mimeType = getMimeTypeFromCloudinaryUrl(course?.promotionalUrl)!;

  return (
    <div className="w-full h-[23rem] flex flex-col rounded-md overflow-hidden shadow-md">
      {/* Image/Video Container */}
      <div className="relative w-full h-60 flex-shrink-0">
        {mimeType === "image/*" ? (
          <Image
            src={course?.promotionalUrl || Thumbnail}
            alt="Course Thumbnail"
            fill
            className="object-cover rounded-t-md"
          />
        ) : (
          <video
            src={course?.promotionalUrl}
            controls
            className="w-full h-full object-cover rounded-t-md"
          />
        )}

        {course?.difficultyLevel && (
          <div
            className={`absolute top-2 left-2 text-sm text-white px-2 py-1 rounded-bl-md rounded-tr-md z-10 
              ${course.difficultyLevel === "beginner"
                ? "bg-green-600"
                : course.difficultyLevel === "intermediate"
                  ? "bg-yellow-600"
                  : course.difficultyLevel === "hard"
                    ? "bg-red-600"
                    : "bg-gray-600"
              }
              `}
          >
            {generalHelpers.capitalizeWords(course.difficultyLevel)}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col justify-between p-3">
        <div>
          <h2 className="text-sm font-semibold line-clamp-2">
            {generalHelpers.capitalizeWords(course?.title)}
          </h2>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-600"></p>
            <p className="text-sm text-primary-700">
              {generalHelpers.getCurrencySymbol(course?.currency)}
              {course?.isPaid ? course.amount : "Free"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Link
            href={`/studio/course-management/${course?.id}`}
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            View course
          </Link>
          {!course?.isPublished && (
            <Button variant="secondary" size="sm">
              Draft
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playlist;