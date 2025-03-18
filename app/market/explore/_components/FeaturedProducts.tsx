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
  isSaved,
  handleToggleSave,
}) => {
  const { setSearchRoom } = useMarketContext();
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
  }, [searchQuery]);

  useEffect(() => {
    const tabFromUrl = (searchParams.get("tab") as TabValue) || "All";
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <Tabs value={activeTab} className="w-auto">
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
          <input
            onChange={(e) => handleSearchQuery(e)}
            type="text"
            placeholder="Search"
            className="w-48 p-1 border rounded-md"
          />
        </div>
      </TabsList>

      {productCategories.map((tab) => (
        <TabsContent key={tab.category} value={tab.category}>
          <h2 className="mb-3 font-bold">Featured Products</h2>
          <div className="flex flex-wrap gap-4 sm:justify-evenly md:justify-evenly">
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
  );
};

export default FeaturedProducts;
