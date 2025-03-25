"use client";
import React from "react";
import { useMarketContext } from "@/context/MarketContext";
import ProductCard from "../explore/_components/ProductCard";

const SavedProducts = () => {
  const { savedProducts, isSaved, handleToggleSave } = useMarketContext();

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="font-semibold">Saved</div>
        <input
          type="text"
          placeholder="Search"
          className="w-48 p-1 pl-3 border rounded-lg border-[#DCF4FF] bg-[#FAFDFF]"
        />
      </div>
      <div className=" flex flex-wrap gap-4 ">
        {savedProducts?.length > 0 ? (
          savedProducts?.map((product: any) => (
            <ProductCard
              key={product?.id}
              product={product}
              isSaved={true}
              handleToggleSave={handleToggleSave}
            />
          ))
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-3">
            <h3 className="font-semibold">You have not saved any product</h3>
            <p>Save Products from the Marketplace Explore to purchase later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProducts;
