"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useMarketContext } from "@/context/MarketContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ExploreCategories from "./ExploreCategories";
import FeaturedProducts from "./FeaturedProducts";
import PopularCourses from "./PopularCourses";
import PopularEvents from "./PopularEvents";

export type TabValue =
  | "All"
  | "Digital Products"
  | "E-Books"
  | "Courses"
  | "Events"
  | "Services";

const MarketPlaceExplore = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { fetchProducts, fetchPopularCourses, fetchPopularEvents, handleToggleSave, isSaved } =
    useMarketContext();

  const initialTab = (searchParams.get("tab") as TabValue) || "All";
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);
  const [products, setProducts] = useState<any>(null);
  const [courses, setCourses] = useState<any>(null);
  const [events, setEvents] = useState<any>(null);

  const productCategories = [
    { category: "All", desc: "Explore all products", color: "bg-gray-200" },
    {
      category: "Digital Products",
      desc: "Explore digital assets",
      color: "bg-blue-200",
    },
    {
      category: "E-Books",
      desc: "Discover amazing books",
      color: "bg-green-200",
    },
    {
      category: "Courses",
      desc: "Upgrade your skills",
      color: "bg-yellow-200",
    },
    { category: "Events", desc: "Find upcoming events", color: "bg-red-200" },
    {
      category: "Services",
      desc: "Find professional services",
      color: "bg-purple-200",
    },
  ];

  const handleTabChange = useCallback(
    (newTab: TabValue) => {
      setActiveTab(newTab);
      router.push(`${pathname}?tab=${newTab}`);
    },
    [router, pathname]
  );

  // Fetch products when the tab changes
  useEffect(() => {
    const courses: any = fetchPopularCourses();
    const events: any = fetchPopularEvents();
    const fetchAndSetProducts = async () => {
      const products: any = fetchProducts();
      if (activeTab === "All") {
        setProducts(products);
      } else {
        setProducts(
          products?.filter((product: any) => product.category === activeTab)
        );
      }
    };
    fetchAndSetProducts();
    setCourses(courses);
    setEvents(events);
  }, [activeTab, fetchProducts, fetchPopularCourses, fetchPopularEvents]);

  // Listen for changes in the URL to update the active tab
  useEffect(() => {
    const tabFromUrl = (searchParams.get("tab") as TabValue) || "All";
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  return (
    <div>
      <div>
        <FeaturedProducts
          productCategories={productCategories}
          products={products}
          isSaved={isSaved}
          handleToggleSave={handleToggleSave}
        />
      </div>

      <div className="mt-10">
        <ExploreCategories
          productCategories={productCategories}
          pathname={pathname}
          handleTabChange={handleTabChange}
        />
      </div>
      <div className="mt-10">
        <PopularCourses
          courses={courses}
          isSaved={isSaved}
          handleToggleSave={handleToggleSave}
          item={courses}
        />
      </div>
      <div className="mt-10">
        <PopularEvents
          events={events}
          isSaved={isSaved}
          handleToggleSave={handleToggleSave}
          item={events}
        />
      </div>
    </div>
  );
};

export default MarketPlaceExplore;
