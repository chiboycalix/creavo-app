"use client";

import React, { useEffect, useState } from "react";
import SaveProductButton from "@/components/marketplace/SaveProductButton";
import { useMarketContext } from "@/context/MarketContext";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

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
  isSaved,
}) => {
  const isVideo = product?.promotionalUrl?.endsWith(".mp4") ?? false;

  return (
    <Link
      href={ROUTES.MARKET.PRODUCT(product?.id)}
      key={product?.id}
      className="relative flex flex-col items-center gap-3 bg-white rounded-lg border border-gray-200 shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg w-[calc(25%-16px)] min-w-[200px] max-w-[300px]"
    >
      {/* Image Wrapper */}
      <div className="w-full h-44 overflow-hidden bg-gray-100">
        {isVideo ? (
          <video
            src={product?.promotionalUrl || undefined}
            className="w-full h-full object-cover transition-opacity duration-200 hover:opacity-80"
            autoPlay
            loop
            muted
          />
        ) : (
          <img
            src={product?.promotionalUrl || undefined}
            alt={product?.title || "image"}
            className="w-full h-full object-cover transition-opacity duration-200 hover:opacity-80"
          />
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-3 w-full p-3">
        <div className="text-center">
          <h4 className="font-semibold text-md text-gray-800 w-full">
            {product?.title}
          </h4>
          <p className="w-full text-sm text-gray-500 underline">{product?.description}</p>
        </div>

        <div className="flex  items-center justify-between w-full text-gray-700">
          <div className="flex items-center gap-1 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
              />
            </svg>
            {product?.rating > 0 ? (
              <span>{product?.rating}</span>
            ) : (
              <span>No rating</span>
            )}
          </div>

          <div className="flex items-center bg-[#DFF8F6] px-2 py-0.5 rounded-md text-sm font-medium">
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
          product={product}
          initialIsSaved={isSaved}
          onToggle={() => handleToggleSave(product as any)}
        />
      </div>
    </Link>
  );
};

export default ProductCard;
