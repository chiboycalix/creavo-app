"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useMarketContext } from "@/context/MarketContext";

const ProductItem = () => {
  const { fetchSingleProduct } = useMarketContext();
  const params = useParams();
  const product = fetchSingleProduct(params?.id);
  console.log(product);

  return (
    <div className="flex">
      <div className="w-[30%] bg-blue-500">
        
      </div>

      <div className="w-[70%] bg-yellow-400">Right</div>
    </div>
  );
};

export default ProductItem;
