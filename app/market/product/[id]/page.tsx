"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMarketContext } from "@/context/MarketContext";
import { Product } from "@/context/MarketContext";
import { ArrowLeft } from "lucide-react";
import CourseProduct from "../_components/Course";
import EventProduct from "../_components/Events";

const ProductItem = () => {
  const { fetchSingleCourseProduct } = useMarketContext();
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [productType, setProductType] = useState("");

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

  const comments = [
    {
      name: "Sophia Johnson",
      stars: 4,
      body: "This product exceeded my expectations! The quality is top-notch, and the design is sleek and modern. I found it easy to use, and it has made my daily tasks much more manageable. Highly recommend it to anyone looking for a reliable solution.",
      time: "1 Month",
      avatar: "/assets/mockImage.png",
    },
    {
      name: "Sophia Johnson",
      stars: 4,
      body: "This product exceeded my expectations! The quality is top-notch, and the design is sleek and modern. I found it easy to use, and it has made my daily tasks much more manageable. Highly recommend it to anyone looking for a reliable solution.",
      time: "1 Month",
      avatar: "/assets/mockImage.png",
    },
  ];

  const navigateBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await fetchSingleCourseProduct(params?.id);
      setProduct(fetchedProduct);
    };

    fetchProduct();
  }, [params?.id, fetchSingleCourseProduct, product?.category]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <button onClick={navigateBack} className="flex ">
          <ArrowLeft />
          Back
        </button>
      </div>
      <div>
        <CourseProduct product={product} comments={comments} />
      </div>
    </div>
  );
};

export default ProductItem;
