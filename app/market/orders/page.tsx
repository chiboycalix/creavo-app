"use client";

import React from "react";
import ProductCard from "../explore/_components/ProductCard";
import { useMarketContext } from "@/context/MarketContext";

const Orders = () => {
  const { isSaved, handleToggleSave, fetchOrders } = useMarketContext();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col bg-white py-3 gap-3">
        <h1 className="p-3 font-bold">Orders</h1>
        <div className="flex flex-wrap gap-4">
          {fetchOrders()?.map((item: any) => (
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

export default Orders;
