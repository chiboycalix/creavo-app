"use client";

import React from "react";
import { useMarketContext } from "@/context/MarketContext";
import { EllipsisVerticalIcon, StarIcon } from "lucide-react";
const SellerDashboard = () => {
  const { listedCourses, isSaved, handleToggleSave } = useMarketContext();

  const listingsSection = [
    {
      title: "Total Listings",
      value: listedCourses?.length,
    },
    {
      title: "Active Listings",
      value: listedCourses?.length,
    },
  ];

  return (
    <div className="flex flex-col gap-4 pt-3">
      <div className="bg-white">
        <h1 className="p-3 font-bold">Overview</h1>
        <div className="flex justify-between w-full p-3 gap-3">
          <div className="flex flex-col flex-1 py-4 pr-5 border-dashed border-r-2 border-[#D9DEF1] gap-4">
            <p className="">Total Amount</p>
            <h3 className={`text-[#29CC6A] font-bold text-xl`}>$2,868.99</h3>
          </div>

          <div className="flex flex-col flex-1 py-4 pr-5 border-dashed border-r-2 border-[#D9DEF1] gap-4">
            <p className="">Number of Items sold</p>
            <h3 className={`text-[] font-bold text-xl`}>3,422</h3>
          </div>

          <div className="flex flex-col flex-1 py-4 pr-5 border-dashed border-r-2 border-[#D9DEF1] gap-4">
            <p className="">Reviews</p>
            <h3 className={`flex font-bold text-xl`}>
              <StarIcon className="text-black fill-current" /> 4.9 (86)
            </h3>
          </div>
        </div>
      </div>

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
      </div>

      <div>
        {listedCourses?.map((item: any, index: any) => {
          const isVideo = item?.promotionalUrl?.endsWith(".mp4") ?? false;

          <div
            key={index}
            className="flex h-auto gap-10 bg-white p-4 shadow-md rounded-lg hover:border border-primary-100"
          >
            <div className="w-1/4">
              {isVideo ? (
                <video
                  src={item?.promotionalUrl}
                  autoPlay
                  loop
                  muted
                  className="rounded-md"
                />
              ) : (
                <img
                  src={item?.promotionalUrl}
                  alt="img"
                  className="rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col justify-between gap-5">
              <h2 className="font-bold">{item?.title}</h2>
              <p>{item?.description}</p>
              <div className="flex gap-5 justify-between items-center">
                <div className="flex gap-2">
                  <div className="border-r-2 pr-3 font-bold text-[#00B5FF]">
                    Active
                  </div>
                  <div>0 Clicks</div>
                </div>
                <div className="bg-[#DFF8F6] px-2 py-1 rounded-md shadow-md">
                  ${item?.amount}
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <button className="w-3/4 bg-primary-700 text-white rounded-md h-10">
                  Share
                </button>
                <div>
                  <EllipsisVerticalIcon />
                </div>
              </div>
            </div>
          </div>;
        })}
      </div>
    </div>
  );
};

export default SellerDashboard;
