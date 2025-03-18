import React from "react";
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

interface Product {
  seller: {
    avatar: string;
  };
  price: number;
  title: string;
  description: string;
  rating: number;
}

interface CourseProductProps {
  product: Product;
  comments: any;
}

const CourseProduct: React.FC<CourseProductProps> = ({ product, comments }) => {
  const { showCheckoutCard, setShowCheckoutCard } = useMarketContext();
  const modules = [
    {
      title: "Module 1: Introduction",
      lessons: [
        {
          title: "Lesson 1: Getting Started",
          duration: "10:00",
          type: "video",
        },
        {
          title: "Quiz 1: Setting Up",
          duration: "15:00",
          type: "quiz",
        },
      ],
    },
    {
      title: "Module 2: Intermediate",
      lessons: [
        {
          title: "Lesson 1: Getting Started",
          duration: "10:00",
          type: "video",
        },
        {
          title: "Quiz 1: Setting Up",
          duration: "15:00",
          type: "quiz",
        },
      ],
    },
  ];

  console.log("CourseProduct", product);

  return (
    <div className="flex gap-6 p-8 bg-gray-50 rounded-lg shadow-md">
      <ImageCard product={product} />

      <div className="flex flex-col gap-5 w-[70%] bg-white p-6 rounded-lg shadow-sm">
        <ProductDetails product={product} />

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            What you will get
          </h3>
          <div className="flex flex-col gap-3 mt-2 ">
            {modules.map((item, index) => (
              <div
                key={index}
                className="border-2 p-2 rounded-lg items-center"
              >
                <Disclosure as="div" className="" defaultOpen={true}>
                  <DisclosureButton className="group flex w-full items-center justify-between py-4">
                    <h2 className="font-bold text-black group-data-[hover]:text-black">
                      {item.title}
                    </h2>
                    <ChevronDownIcon className="size-5 fill-black group-data-[hover]:fill-black group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className=" text-black ">
                    <div className="flex flex-col border-t-2 border-gray-200">
                      {item.lessons.map((lesson, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-2 transition"
                        >
                          <div className="bg-[#D8DFED] p-2 rounded-full">
                            {lesson.type === "video" ? (
                              <SquarePlayIcon size={18} />
                            ) : (
                              <MessageCircleQuestionIcon size={18}/>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <h3 className="font-medium text-black">
                              {lesson.title}
                            </h3>
                            <span className="text-sm flex items-center gap-2">
                              <SquarePlayIcon size={24} />
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              </div>
            ))}
          </div>
        </div>

        <ProductReviews
          product={product}
          comments={comments}
          rating={4}
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

export default CourseProduct;
