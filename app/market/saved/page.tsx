"use client";
import React from "react";
import { useMarketContext } from "@/context/MarketContext";
import ProductCard from "../explore/_components/ProductCard";

const SavedProducts = () => {
  const { savedProducts, isSaved, handleToggleSave } = useMarketContext();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <input
          type="text"
          placeholder="Search for products"
          className="w-1/2 p-2 border-2 border-gray-300 rounded-md"
        />
      </div>
      <div className="mt-10 flex flex-wrap gap-4 ">
        {savedProducts?.length > 0 ? (
          savedProducts?.map((product: any) => (
            <ProductCard
              key={product.id}
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
