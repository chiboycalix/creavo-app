"use client";
import React from "react";
import { useMarketContext } from "@/context/MarketContext";
import SaveProductButton from "@/components/marketplace/SaveProductButton";
import ProductCard from "../explore/_components/ProductCard";
import OtherCard from "../explore/_components/OtherCard";

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
        {savedProducts?.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
            isSaved={isSaved}
            handleToggleSave={handleToggleSave}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedProducts;
