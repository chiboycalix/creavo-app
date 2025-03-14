import React from "react";
import { useMarketContext } from "@/context/MarketContext";

const ImageCard = ({ product }: any) => {
  const { showCheckoutCard, setShowCheckoutCard } = useMarketContext();
  return (
    <div className="flex flex-col gap-4 w-[30%] bg-white p-4 rounded-lg shadow-sm">
      <div className="w-full">
        <img
          src={product?.seller?.avatar}
          alt="Product Image"
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>

      <div>
        <h3 className="text-xl font-bold text-[#DE2424]">
          {"$"}
          {product?.price}
        </h3>
      </div>

      <div className="flex flex-col items-start gap-3">
        <button
          onClick={() => setShowCheckoutCard(true)}
          className="w-full text-white bg-[#0073B4] py-2 rounded-lg hover:bg-[#005a8c] transition"
        >
          Buy Now
        </button>
        <button className="w-full text-gray-800 bg-[#D8DFED] py-2 rounded-lg hover:bg-[#c3cee2] transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ImageCard;
