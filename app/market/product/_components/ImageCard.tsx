import React from "react";
import { useMarketContext } from "@/context/MarketContext";

const ImageCard = ({ product }: any) => {
  const { showCheckoutCard, setShowCheckoutCard } = useMarketContext();
  const isVideo = product?.promotionalUrl?.endsWith(".mp4") ?? false;

  return (
    <div className="flex flex-col gap-4 w-[30%] bg-white p-4 rounded-lg shadow-sm">
      <div className="w-full">
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

      <div>
        {!product?.isPaid ? (
          <h3 className="text-xl font-bold text-[#DE2424]">Free</h3>
        ) : (
          <h3 className="text-xl font-bold text-[#DE2424]">
            {product?.currency}
            {product?.amount}
          </h3>
        )}
      </div>

      <div className="flex flex-col items-start gap-3">
        <button
          onClick={() => setShowCheckoutCard(true)}
          className="w-full text-white bg-[#0073B4] py-2 rounded-lg hover:bg-[#005a8c] transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ImageCard;
