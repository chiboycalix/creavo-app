import React from "react";
import { FileIcon } from "lucide-react";
import ProductReviews from "./Reviews";
import ImageCard from "./ImageCard";
import ProductDetails from "./Details";
import CheckoutCard from "./CheckoutCard";
import { useMarketContext } from "@/context/MarketContext";

interface Product {
  seller: {
    avatar: string;
  };
  price: number;
  title: string;
  description: string;
  rating: number;
}

interface EbookProductProps {
  product: Product;
  comments: any;
}

const EbookProduct: React.FC<EbookProductProps> = ({ product, comments }) => {
  const { showCheckoutCard, setShowCheckoutCard } = useMarketContext();
  const downloadFiles = [
    {
      id: 1,
      fileName: "Chapter 1 - Introduction",
    },
    {
      id: 2,
      fileName: "Chapter 2 - Main Lesson",
    },
  ];

  return (
    <div className="flex gap-6 p-8 bg-gray-50 rounded-lg shadow-md">
      <ImageCard product={product} />

      <div className="flex flex-col gap-5 w-[70%] bg-white p-6 rounded-lg shadow-sm">
        <ProductDetails product={product} />

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            What you will get
          </h3>
          <div className="flex flex-col gap-3 mt-2">
            {downloadFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 border rounded-md bg-gray-100 hover:bg-gray-200 transition"
              >
                <div className="text-gray-700 font-medium">{file?.id}</div>
                <div className="bg-[#D1DCF180] p-2 rounded-md">
                  <FileIcon />
                </div>
                <div className="text-gray-700">{file?.fileName}</div>
              </div>
            ))}
          </div>
        </div>

        <ProductReviews
          product={product}
          comments={comments}
          rating={product.rating}
          totalReviews={10}
        />
      </div>
      {showCheckoutCard && (
        <CheckoutCard
          isOpen={showCheckoutCard}
          onClose={() => {
            setShowCheckoutCard(false);
          }}
          product={product}
          // anchorRect={addEventAnchorRect}
        />
      )}
    </div>
  );
};

export default EbookProduct;
