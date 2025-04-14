"use client";

import React, { useEffect } from "react";
import { Heart } from "lucide-react";
import { useMarketContext } from "@/context/MarketContext";

interface LikeButtonProps {
  productId?: any;
  initialIsSaved?: boolean;
  savedId?: number;
  onToggle: (product: any) => void;
  product?: any;
}

const SaveProductButton: React.FC<LikeButtonProps> = ({
  onToggle,
  initialIsSaved,
  product,
}) => {
  const { setIsSaved, savedProducts, handleToggleSave } = useMarketContext();

  const handleToggle = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    event.preventDefault();
    handleToggleSave(product);
  };

  useEffect(() => {
    const isProductSaved = savedProducts?.some(
      (product: any) => product?.id === product?.id
    );
    setIsSaved(isProductSaved);
  }, [product, savedProducts, setIsSaved]);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={(e) => handleToggle(e)}
        className="flex items-center focus:outline-none transition-opacity disabled:opacity-50"
        aria-label={initialIsSaved ? "Unsave product" : "Save post"}
      >
        <Heart
          className={`w-6 h-6 transition-colors duration-200 
            ${
              initialIsSaved
                ? "fill-red-500 stroke-red-500"
                : "md:hover:stroke-red-500 stroke-white fill-white md:fill-gray-400 md:hover:fill-red-500"
            }`}
        />
      </button>
    </div>
  );
};

export default SaveProductButton;
