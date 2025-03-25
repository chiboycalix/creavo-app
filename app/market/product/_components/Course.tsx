"use client";

import React, { useState, useEffect } from "react";
import {
  FileIcon,
  MessageCircleQuestionIcon,
  SquarePlayIcon,
} from "lucide-react";
import ProductReviews from "./Reviews";
import ImageCard from "./ImageCard";
import ProductDetails from "./Details";
import CheckoutCard from "./CheckoutCard";
import { useMarketContext } from "@/context/MarketContext";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface MediaItem {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  mimeType: string;
  description: string;
}

interface Module {
  id: number;
  title: string;
  media: MediaItem[];
}

interface Product {
  seller: { avatar: string };
  price: number;
  title: string;
  description: string;
  rating: number;
  modules: Module[];
}

interface CourseProductProps {
  product: Product;
  comments: any;
}

const CourseProduct: React.FC<CourseProductProps> = ({ product, comments }) => {
  const { showCheckoutCard, setShowCheckoutCard } = useMarketContext();
  const [durations, setDurations] = useState<{ [key: number]: string }>({});

  const handleLoadedMetadata = (
    event: React.SyntheticEvent<HTMLVideoElement>,
    mediaId: number
  ) => {
    const video = event.currentTarget;
    const duration = video?.duration;
    const formattedDuration = new Date(duration * 1000)
      .toISOString()
      .substring(11, 19);
    setDurations((prev) => ({ ...prev, [mediaId]: formattedDuration }));
  };

  return (
    <div className="flex gap-6 p-8 rounded-lg justify-center">
      <ImageCard product={product} />

      <div className="flex flex-col gap-5 w-[60%] bg-white p-6 rounded-lg shadow-sm">
        <ProductDetails product={product} />

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            What you will get
          </h3>
          <div className="flex flex-col gap-3 mt-2">
            {product?.modules?.map((module) => (
              <div
                key={module.id}
                className="border p-2 rounded-lg items-center"
              >
                <Disclosure as="div" className="" defaultOpen={true}>
                  <DisclosureButton className="group flex w-full items-center justify-between py-4">
                    <h2 className="font-bold text-black group-data-[hover]:text-black">
                      {module?.title}
                    </h2>
                    <ChevronDownIcon className="size-5 fill-black group-data-[hover]:fill-black group-data-[open]:rotate-180" />
                  </DisclosureButton>

                  <DisclosurePanel className="text-black">
                    <div className="flex flex-col border-t border-gray-200">
                      {module?.media?.length > 0 ? (
                        module?.media?.map((mediaItem) => (
                          <div
                            key={mediaItem?.id}
                            className="flex items-center gap-4 p-2 transition"
                          >
                            <div className="bg-[#D8DFED] p-2 rounded-full">
                              {mediaItem?.mimeType?.includes("video") ? (
                                <SquarePlayIcon size={18} />
                              ) : (
                                <MessageCircleQuestionIcon size={18} />
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <h3 className="font-medium text-black">
                                {mediaItem?.title}
                              </h3>
                              <span className="text-sm flex items-center gap-2">
                                <SquarePlayIcon size={24} />
                                {mediaItem?.mimeType?.includes("video") &&
                                  durations[mediaItem?.id]}
                              </span>
                            </div>
                            {mediaItem?.mimeType?.includes("video") && (
                              <video
                                src={mediaItem?.url}
                                onLoadedMetadata={(e) => handleLoadedMetadata(e, mediaItem?.id)}
                                className="hidden"
                              />
                            )}

                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 p-2">
                          No media available
                        </p>
                      )}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              </div>
            ))}
          </div>
        </div>

      </div>
      {showCheckoutCard && (
        <CheckoutCard
          isOpen={showCheckoutCard}
          onClose={() => setShowCheckoutCard(false)}
          product={product}
        />
      )}
    </div>
  );
};

export default CourseProduct;
