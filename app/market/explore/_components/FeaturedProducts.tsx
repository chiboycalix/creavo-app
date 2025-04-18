import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "./ProductCard";
import { TabValue } from "./MarketPlaceExplore";
import { useSearchParams } from "next/navigation";
import { useMarketContext } from "@/context/MarketContext";

interface FeaturedProductsProps {
  productCategories: { category: string }[];
  products: any[];
  isSaved: boolean;
  handleToggleSave: (id: any) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  productCategories,
  products,
  handleToggleSave,
}) => {
  const { setSearchRoom, isSaved, setIsSaved, savedProducts } =
    useMarketContext();
  const [activeTab, setActiveTab] = useState<string>(
    productCategories[0].category
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchParams = useSearchParams();

  const handleTabChange = (category: string) => {
    setActiveTab(category);
  };

  const handleSearchQuery = (e: any) => {
    e.preventDefault();
    const query = e.target.value;
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      setSearchRoom(true);
    } else {
      setSearchRoom(false);
    }
  }, [searchQuery, setSearchRoom]);

  useEffect(() => {
    const tabFromUrl = (searchParams.get("tab") as TabValue) || "All";
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  return (
    <Tabs value={activeTab} className="w-auto">
      {/* <TabsList className="flex justify-between mb-10">
        {productCategories?.map((tab) => (
          <TabsTrigger
            key={tab?.category}
            value={tab?.category}
            className="w-[10%] rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-900"
            onClick={() => handleTabChange(tab?.category as TabValue)}
          >
            {tab?.category}
          </TabsTrigger>
        ))}
      </TabsList> */}
      <div className="flex justify-end mb-4">
        <input
          onChange={(e) => handleSearchQuery(e)}
          type="text"
          placeholder="Search"
          className="w-48 p-1 pl-3 border-2 rounded-lg border-[#DCF4FF] bg-[#FAFDFF]"
        />
      </div>

      {productCategories.map((tab) => (
        <TabsContent key={tab.category} value={tab.category}>
          <div className="flex flex-wrap gap-4 ">
            {products.length > 0 ? (
              products
                ?.filter(
                  (product: any) =>
                    tab.category === "All" || product.category === tab.category
                )
                .map((product: any) => {
                  const isProductSaved = savedProducts?.some(
                    (savedProduct: any) => savedProduct?.id === product?.id
                  );

                  return (
                    <ProductCard
                      key={product?.id}
                      product={product}
                      isSaved={isProductSaved}
                      handleToggleSave={handleToggleSave}
                    />
                  );
                })
            ) : (
              <div className="w-full flex flex-col items-center justify-center gap-3">
                <h3 className="font-semibold">
                  There are no products listed in the marketplace at the moment
                </h3>
                <p>Please check back later</p>
              </div>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default FeaturedProducts;
