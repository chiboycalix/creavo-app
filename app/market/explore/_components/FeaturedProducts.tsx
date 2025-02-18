import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "./ProductCard";
import { TabValue } from "./MarketPlaceExplore";
import { useSearchParams } from "next/navigation";

interface FeaturedProductsProps {
  productCategories: { category: string }[];
  products: any[];
  isSaved: boolean;
  handleToggleSave: (id: any) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  productCategories,
  products,
  isSaved,
  handleToggleSave,
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    productCategories[0].category
  );
  const searchParams = useSearchParams();

  const handleTabChange = (category: string) => {
    setActiveTab(category);
  };

  // Listen for changes in the URL to update the active tab
  useEffect(() => {
    const tabFromUrl = (searchParams.get("tab") as TabValue) || "All";
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <div  className="w-full">
      <Tabs value={activeTab}  className="w-auto">
        <TabsList className="flex justify-between mb-10">
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
          <div>
            <input type="text" placeholder="Search" className="w-48" />
          </div>
        </TabsList>

        {productCategories.map((tab) => (
          <TabsContent key={tab.category} value={tab.category}>
            <h2>Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products
              ?.filter(
                (product: any) =>
                tab.category === "All" || product.category === tab.category
              )
              .map((product: any) => (
                <ProductCard
                key={product.id}
                product={product}
                isSaved={isSaved}
                handleToggleSave={handleToggleSave}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FeaturedProducts;
