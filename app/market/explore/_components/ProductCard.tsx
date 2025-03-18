"use client";

import React from "react";
import SaveProductButton from "@/components/marketplace/SaveProductButton";
import { useMarketContext } from "@/context/MarketContext";
import Link from "next/link";

interface Product {
  id: any;
  seller: {
    id: any;
    name: string;
    avatar: string;
  };
  title: string;
  description: string;
  rating?: any;
  numberOfParticipants?: any;
  price: number;
  type?: string;
}

interface Course {
  id: any;
  seller: {
    id: any;
    name: string;
    avatar: string;
  };
  title: string;
  description: string;
  rating?: any;
  numberOfParticipants?: any;
  isPaid: boolean;
  amount: number;
  type?: string;
  currency?: string;
  promotionalUrl?: string;
  difficultyLevel?: string;
}

interface ProductCardProps {
  product: Course;
  isSaved: boolean;
  handleToggleSave: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  handleToggleSave,
}) => {
  const { isSaved } = useMarketContext();
  const isVideo = product?.promotionalUrl?.endsWith(".mp4") ?? false;

  return (
    <Link
      href={`/market/product/${product?.id}`}
      key={product?.id}
      className="relative flex flex-col gap-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg w-[calc(25%-16px)] min-w-[200px] max-w-[300px]"
    >
      {/* Image Wrapper */}
      <div className="w-full h-40 overflow-hidden rounded-md bg-gray-100">
        {isVideo ? (
          <video
            src={product?.promotionalUrl}
            className="w-full h-full object-cover transition-opacity duration-200 hover:opacity-80"
            autoPlay
            loop
            muted
          />
        ) : (
          <img
            src={product?.promotionalUrl}
            alt="product image"
            className="w-full h-full object-cover transition-opacity duration-200 hover:opacity-80"
          />
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-3 p-2">
        <div className="text-center">
          <h3 className="font-semibold text-lg text-gray-800">
            {product?.title}
          </h3>
          <p className="text-sm text-gray-500">{product?.description}</p>
        </div>

        <div className="flex justify-between items-center text-gray-700">
          {product.numberOfParticipants ? (
            <div className="flex items-center gap-1 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 2l8 4-8 4-8-4 8-4zm0 6v10m-4-4h8"
                />
                <circle cx="12" cy="18" r="2" />
              </svg>
              <span>{product?.numberOfParticipants}</span>
            </div>
          ) : product.rating > 0 ? (
            <div className="flex items-center gap-1 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="black"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                />
              </svg>
              <span>{product?.rating}</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">
              No ratings or participants
            </span>
          )}
          <div className="flex items-center bg-[#DFF8F6] px-3 py-1 rounded-md text-sm font-medium">
            {!product?.isPaid ? (
              <span>Free</span>
            ) : (
              <span>
                {product?.currency}
                {product?.amount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="absolute bg-white bg-opacity-90 top-2 right-2 rounded-full p-1 shadow-md">
        <SaveProductButton
          productId={product?.id}
          initialIsSaved={isSaved}
          onToggleSave={() => handleToggleSave(product as any)}
        />
      </div>
    </Link>
  );
};

export default ProductCard;
