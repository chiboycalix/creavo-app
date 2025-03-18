"use client";

import React, { useEffect } from "react";
import { Heart } from "lucide-react";
import { useMarketContext } from "@/context/MarketContext";

interface LikeButtonProps {
  productId?: number;
  initialIsSaved?: boolean;
  savedId?: number;
  onToggleSave: (product: any) => void;
}

const SaveProductButton: React.FC<LikeButtonProps> = ({
  productId,
  initialIsSaved,
  savedId,
  onToggleSave,
}) => {
  const { isSaved, setIsSaved, savedProducts } = useMarketContext();

  const handleToggleSave = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    event.preventDefault();
    onToggleSave(productId);
  };

  useEffect(() => {
    const isProductSaved = savedProducts.includes(productId);
    setIsSaved(isProductSaved);
  }, [productId, savedProducts, setIsSaved]);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={(e) => handleToggleSave(e)}
        className="flex items-center focus:outline-none transition-opacity disabled:opacity-50"
        aria-label={isSaved ? "Unsave product" : "Save post"}
      >
        <Heart
          className={`w-6 h-6 transition-colors duration-200 
            ${
              isSaved
                ? "fill-red-500 stroke-red-500"
                : "md:hover:stroke-red-500 stroke-white fill-white md:fill-gray-400 md:hover:fill-red-500"
            }`}
        />
      </button>
    </div>
  );
};

export default SaveProductButton;
