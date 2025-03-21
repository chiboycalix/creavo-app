import React from "react";
import { Product } from "@/context/MarketContext";

const ProductDetails = ({ product }: any) => {
  console.log("product details", product);
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold text-gray-900">{product?.title}</h2>

      <p className="text-gray-600 leading-relaxed">{product?.description}</p>

      <div className="flex items-center gap-2 text-yellow-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
          />
        </svg>
        <span className="text-gray-800 font-medium">
          {product?.rating} <span className="text-gray-500">(10 Reviews)</span>
        </span>
      </div>
    </div>
  );
};

export default ProductDetails;
