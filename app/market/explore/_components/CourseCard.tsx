"use client";

import React from "react";
import SaveProductButton from "@/components/marketplace/SaveProductButton";
import { useMarketContext } from "@/context/MarketContext";
import Link from "next/link";

interface Course {
  id: any;
  seller: {
    id: any;
    name: string;
    avatar: string;
  };
  title: string;
  description: string;
  rating?: any;
  numberOfParticipants?: any;
  amount: number;
  type?: string;
  currency?: string;
  promotionalUrl?: string;
  difficultyLevel?: string;
}

interface CourseCardProps {
  course: Course;
  isSaved: boolean;
  handleToggleSave: ( course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  handleToggleSave,
}) => {
  const { isSaved } = useMarketContext();
  console.log('pro pro',course);
  return (
    <Link
      href={`/market/product/${course?.id}`}
      key={course?.id}
      className="relative flex flex-col gap-4 p-1 bg-white rounded-md border-2 justify-between items-center w-[calc(25%-16px)] min-w-[200px] transition-transform transform hover:scale-105 hover:shadow-lg"
    >
      <div className="flex w-[100%]">
      <img src={course.promotionalUrl} alt="avatar" className="w-full transition-opacity hover:opacity-80" />
      </div>

      <div className="flex flex-col gap-2 p-2">
      <div className="flex flex-col items-center text-center gap-2">
        <h3 className="font-semibold">{course?.title}</h3>
        <p className="text-sm text-gray-500 underline">
        {course?.description}
        </p>
      </div>

      <div className="flex gap-3 justify-between">
        {course?.numberOfParticipants ? (
        <div className="flex items-center gap-1">
          <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-5 h-5 text-black-500"
          >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 2l8 4-8 4-8-4 8-4zm0 6v10m-4-4h8"
          />
          <circle cx="12" cy="18" r="2" />
          </svg>
          <span>{course?.numberOfParticipants}</span>
        </div>
        ) : course?.rating > 0 ? (
        <div className="flex items-center gap-1">
          <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="black"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-5 h-5 text-black-500"
          >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
          />
          </svg>
          <span>{course?.rating}</span>
        </div>
        ) : (
        <span className="text-sm font-semibold">No ratings or participants</span>
        )}
        <div className="flex items-center bg-[#DFF8F6] px-1 rounded-md">
        <span className="text-sm font-semibold">
          {course?.currency}{" "}
          {course?.amount}
        </span>
        </div>
      </div>
      </div>
      <div className="absolute bg-opacity-90 bg-white top-2 right-2 rounded-full p-1">
      <SaveProductButton
        productId={course?.id}
        initialIsSaved={isSaved}
        onToggleSave={() => handleToggleSave(course)}
      />
      </div>
    </Link>
  );
};

export default CourseCard;
