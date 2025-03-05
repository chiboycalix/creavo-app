import React from "react";
import Link from "next/link";
import { TabValue } from "./MarketPlaceExplore";

interface ProductCategory {
  category: string;
  desc: string;
  color: string;
}

interface ExploreCategoriesProps {
  productCategories: ProductCategory[];
  pathname: string;
  handleTabChange: (category: TabValue) => void;
}

const ExploreCategories: React.FC<ExploreCategoriesProps> = ({
  productCategories,
  pathname,
  handleTabChange,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h1>Explore Categories</h1>
      <div className="grid grid-cols-3 gap-4">
        {productCategories
          .filter((product) => product.category !== "All")
          .map((product) => (
            <Link
              key={product.category}
              href={`${pathname}?tab=${product.category}`}
              className={` flex flex-col py-6 gap-3 h-32 items-center  p-4 rounded-md ${product.color}`}
              onClick={() => handleTabChange(product.category as TabValue)}
            >
              <h3>{product.category}</h3>
              <p>{product.desc}</p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ExploreCategories;
