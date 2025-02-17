"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useMarketContext } from "@/context/MarketContext";
import SaveProductButton from "@/components/marketplace/SaveProductButton";

type TabValue =
  | "All"
  | "Digital Products"
  | "E-Books"
  | "Courses"
  | "Events"
  | "Services";

const MarketPlaceExplore = () => {
  const { getCurrentUser } = useAuth();
  const userId = getCurrentUser()?.id;
  const [activeTab, setActiveTab] = useState<TabValue>("All");
  const [products, setProducts] = useState<any>(null);
  const { fetchProducts, handleToggleSave, isSaved, setIsSaved } = useMarketContext();
  const [savedProducts, setSavedProducts] = useState<any>([]);

  useEffect(() => {
    const fetchAndSetProducts = async () => {
      console.log(fetchProducts());
      const products: any = await fetchProducts();
      if (activeTab === "All") {
        setProducts(products);
      } else {
        setProducts(
          products.filter((product: any) => product.category === activeTab)
        );
      }
    };
    fetchAndSetProducts();
  }, [activeTab, fetchProducts]);

  // const handleToggleSave = (productId: any) => {
  //   if (savedProducts?.includes(productId)) {
  //     setSavedProducts(savedProducts?.filter((id: any) => id !== productId));
  //     setIsSaved(false);
  //   } else {
  //     setSavedProducts([...savedProducts, productId]);
  //     setIsSaved(true);
  //   }

  //   console.log("saved products", savedProducts);
  // };

  return (
    <div>
      <Tabs
        defaultValue="All"
        className="w-full"
        onValueChange={(value) => setActiveTab(value as TabValue)}
      >
        <TabsList className="flex justify-between">
          {[
            "All",
            "Digital Products",
            "E-Books",
            "Courses",
            "Events",
            "Services",
          ].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="w-[10%] rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-900"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}

          <div>
            <input type="text" placeholder="Search" className="w-48" />
          </div>
        </TabsList>

        {[
          "All",
          "Digital Products",
          "E-Books",
          "Courses",
          "Events",
          "Services",
        ].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="mt-10 flex flex-wrap gap-4 ">
              {products
                ?.filter(
                  (product: any) => tab === "All" || product.category === tab
                )
                .map((product: any) => (
                  <div
                    key={product.id}
                    className="relative flex flex-col gap-3 p-1 bg-white rounded-md border-2 w-58"
                  >
                    <div className="flex w-[100%]">
                      <img
                        src={product.seller.avatar}
                        alt="avatar"
                        className="w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2 p-2">
                      <div className="flex flex-col items-center gap-2">
                        <h3 className="font-semibold">{product.title}</h3>
                        <p className="text-sm text-gray-500 underline">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex justify-between">
                        {product.rating > 0 ? (
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
                            <span>{product.rating}</span>
                          </div>
                        ) : (
                          <span>No ratings found</span>
                        )}
                        <div className="flex items-center">
                          <span>
                            {"£"}
                            {product.price}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-opacity-90 bg-white top-2 right-2 rounded-full p-1">
                      <SaveProductButton
                        productId={product.id}
                        initialIsSaved={isSaved}
                        onToggleSave={() => handleToggleSave(product)}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>{" "}
    </div>
  );
};

export default MarketPlaceExplore;
