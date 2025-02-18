import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "./ProductCard";
import { TabValue } from "./MarketPlaceExplore";

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

  const handleTabChange = (category: string) => {
    setActiveTab(category);
  };

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList className="flex justify-between mb-10">
        {productCategories.map((tab) => (
          <TabsTrigger
            key={tab.category}
            value={tab.category}
            className="w-[10%] rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-900"
            onClick={() => handleTabChange(tab.category as TabValue)}
          >
            {tab.category}
          </TabsTrigger>
        ))}
        <div>
          <input type="text" placeholder="Search" className="w-48" />
        </div>
      </TabsList>


      {productCategories.map((tab) => (
        <TabsContent key={tab.category} value={tab.category}>
          <h2>Featured Products</h2>
          <div className="flex flex-wrap gap-4">
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
