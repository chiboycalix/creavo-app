import React from "react";
import SaveProductButton from "@/components/marketplace/SaveProductButton";
import { useMarketContext } from "@/context/MarketContext";
import { useEffect, useState } from "react";

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

interface ProductCardProps {
  product: Product;
  isSaved: boolean;
  handleToggleSave: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  handleToggleSave,
}) => {
  const { isSaved } = useMarketContext();
  return (
    <div
      key={product?.id}
      className="relative flex flex-col gap-4 p-1 bg-white rounded-md border-2 w-56 justify-between items-center"
    >
      <div className="flex w-[100%]">
        <img src={product?.seller?.avatar} alt="avatar" className="w-full" />
        </div>

        <div className="flex flex-col gap-2 p-2">
        <div className="flex flex-col items-center text-center gap-2">
          <h3 className="font-semibold">{product?.title}</h3>
          <p className="text-sm text-gray-500 underline">
          {product.description}
          </p>
        </div>

        <div className="flex justify-between">
          {product.numberOfParticipants ? (
          <div className="flex items-center gap-1">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 text-black-500"
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
            <span>{product?.rating}</span>
          </div>
          ) : (
          <span>No ratings or participants found</span>
          )}
          <div className="flex items-center">
          <span>
            {"£"}
            {product?.price}
          </span>
          </div>
        </div>
        </div>
        <div className="absolute bg-opacity-90 bg-white top-2 right-2 rounded-full p-1">
        <SaveProductButton
          productId={product?.id}
          initialIsSaved={isSaved}
          onToggleSave={() => handleToggleSave(product)}
        />
      </div>
    </div>
  );
};

export default ProductCard;
