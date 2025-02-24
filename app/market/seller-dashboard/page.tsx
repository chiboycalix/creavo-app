"use client";

import React from "react";
import ProductCard from "../explore/_components/ProductCard";
import { useMarketContext } from "@/context/MarketContext";
const SellerDashboard = () => {
  const { fetchMyListings, isSaved, handleToggleSave } = useMarketContext();
  const info = [
    {
      title: "Total Amount",
      value: "$2,868",
      color: "#29CC6A",
    },
    {
      title: "Active Listings",
      value: "5",
      color: "#00000",
    },
    {
      title: "Purchased",
      value: "10",
      color: "#00000",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* OVERVIEW SECTION */}
      <div className="bg-white">
        <h1 className="p-3 font-bold">Overview</h1>
        <div className="flex justify-between w-full p-3 gap-3">
          {info?.map((item, index) => (
            <div
              key={index}
              className="flex flex-col flex-1 py-4 pr-5 border-r gap-4"
            >
              <p className="">{item?.title}</p>
              <h3 className={`text-[${item?.color}] font-bold`}>
                {item?.value}
              </h3>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col bg-white py-3 gap-3">
        <h1 className="p-3 font-bold">Your Listings</h1>
        <div className="flex flex-wrap gap-4">
          {fetchMyListings()?.map((item: any) => (
            <ProductCard
              key={item?.id}
              product={item}
              isSaved={isSaved}
              handleToggleSave={handleToggleSave}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
