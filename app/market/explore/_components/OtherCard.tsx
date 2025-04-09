import React from "react";
import SaveProductButton from "@/components/marketplace/SaveProductButton";
import { useMarketContext } from "@/context/MarketContext";

interface Item {
  id: any;
  seller: {
    id: any;
    name: string;
    avatar: string;
  };
  title: string;
  description: string;
  numberOfParticipants: number;
  price: any;
  type?: string;
}

interface ProductCardProps {
  item: Item;
  isSaved: boolean;
  handleToggleSave: (product: Item) => void;
}

const OtherCard: React.FC<ProductCardProps> = ({ item, handleToggleSave }) => {
  const { isSaved } = useMarketContext();
  return (
    <div
      key={item?.id}
      className="relative flex flex-col gap-4 p-1 bg-white rounded-md border-2 w-56"
    >
      <div className="flex w-[100%]">
        <img src={item?.seller?.avatar} alt="avatar" className="w-full" />
      </div>

      <div className="flex flex-col gap-2 p-2">
        <div className="flex flex-col items-center text-center gap-2">
          <h3 className="font-semibold">{item?.title}</h3>
          <p className="text-sm text-gray-500 underline">{item.description}</p>
        </div>

        <div className="flex justify-between">
          {item.numberOfParticipants > 0 ? (
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
              <span>{item?.numberOfParticipants}</span>
            </div>
          ) : (
            <span>No Participants</span>
          )}
          <div className="flex items-center">
            {item.price > 0 ? (
              <span>
                {"£ "}
                {item?.price}
              </span>
            ) : (
              <span>Free</span>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bg-opacity-90 bg-white top-2 right-2 rounded-full p-1">
        <SaveProductButton
          product={item}
          initialIsSaved={isSaved}
          onToggle={() => handleToggleSave(item)}
        />
      </div>
    </div>
  );
};

export default OtherCard;
