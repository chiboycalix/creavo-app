"use client";
import React from "react";
import { useMarketContext } from "@/context/MarketContext";
import SaveProductButton from "@/components/marketplace/SaveProductButton";

const SavedProducts = () => {
  const { savedProducts, isSaved, handleToggleSave } = useMarketContext();
  console.log(savedProducts);
  return (
    <div className="flex flex-col gap-4 p-4">
        <div>
            <input type="text" placeholder="Search for products" className="w-1/2 p-2 border-2 border-gray-300 rounded-md" />
        </div>
      <div className="mt-10 flex flex-wrap gap-4 ">
        {savedProducts?.map((product: any) => (
          <div
            key={product.id}
            className="relative flex flex-col gap-3 p-1 bg-white rounded-md border-2 w-58"
          >
            <div className="flex w-[100%]">
              <img
                src={product.seller.avatar}
                alt="avatar"
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-2 p-2">
              <div className="flex flex-col items-center gap-2">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-500 underline">
                  {product.description}
                </p>
              </div>

              <div className="flex justify-between">
                {product.rating > 0 ? (
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
                    <span>{product.rating}</span>
                  </div>
                ) : (
                  <span>No ratings found</span>
                )}
                <div className="flex items-center">
                  <span>
                    {"£"}
                    {product.price}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute bg-opacity-90 bg-white top-2 right-2 rounded-full p-1">
              <SaveProductButton
                productId={product.id}
                initialIsSaved={isSaved}
                onToggleSave={() => handleToggleSave(product)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedProducts;
