"use client";

import React, { use, useEffect } from "react";
import { useMarketContext } from "@/context/MarketContext";
import CourseCard from "../explore/_components/CourseCard";

const YourListing = () => {
  const { isSaved, handleToggleSave, listedCourses } = useMarketContext();

  const listingsSection = [
    {
      title: "Total Listings",
      value: 54,
    },
    {
      title: "Active Listings",
      value: 40,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="">
        <h1 className="p-3 font-bold">Your Listings</h1>
        <div className="flex justify-start w-full p-3 gap-3">
          {listingsSection.map((item, index) => (
            <div
              key={index}
              className=" bg-white flex flex-col p-4  border-2 border-[#D9DEF1] rounded-md gap-4 w-1/3"
            >
              <p className="">{item.title}</p>
              <h3 className={` font-bold text-xl`}>{item.value}</h3>
            </div>
          ))}
        </div>
      </div>{" "}
      <div className="flex flex-wrap gap-4">
        {listedCourses?.map((item: any) => (
          <CourseCard
            key={item?.id}
            course={item}
            isSaved={isSaved}
            handleToggleSave={handleToggleSave}
          />
        ))}
      </div>
    </div>
  );
};

export default YourListing;
