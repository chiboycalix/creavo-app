"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useMarketContext } from "@/context/MarketContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import FeaturedProducts from "./FeaturedProducts";
import { ChevronDown, ChevronUp } from "lucide-react"; // Icon for dropdown arrow

export type TabValue =
  | "All"
  // | "Digital Products"
  // | "E-Books"
  | "Courses";
// | "Events"
// | "Services";

const MarketPlaceExplore = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    fetchCourseProducts,
    fetchPopularCourses,
    handleToggleSave,
    isSaved,
    searchRoom,
    fetchListedCourses,
    products,
    setProducts,
    setIsSaved, 
    savedProducts,
  } = useMarketContext();

  const initialTab = (searchParams.get("tab") as TabValue) || "All";
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);
  const [courses, setCourses] = useState<any>(null);
  const [events, setEvents] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState("Select Filter");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPrices, setSelectedPrices] = useState<string[]>(["all"]);
  const [isRatingsDropdownOpen, setIsRatingsDropdownOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const ratingsOptions = [5, 4, 3, 2, 1];

  const options = [
    { value: "default", label: "Default" },
    { value: "recentlyAdded", label: "Recently Added" },
    { value: "highestRated", label: "Highest Rated" },
    { value: "mostReviews", label: "Most Reviews" },
    { value: "priceHighToLow", label: "Price: High to Low" },
  ];

  const priceOptions = [
    { value: "All", label: "All" },
    { value: "free", label: "Free" },
    { value: "under5", label: "Under $5" },
    { value: "5to25", label: "$5 - $25" },
    { value: "25to40", label: "$25 - $40" },
    { value: "40plus", label: "$40+" },
  ];


  const handleRatingSelect = (rating: any) => {
    setSelectedRating(rating);
    setIsRatingsDropdownOpen(false);
  };

  // Handle selection
  const handleSelectFactor = (label: string) => {
    setSelectedFilter(label);
    setIsDropdownOpen(false); // Hide dropdown after selection
  };

  const productCategories = [
    { category: "All", desc: "Explore all products", color: "bg-gray-200" },
    // {
    //   category: "E-Books",
    //   desc: "Discover amazing books",
    //   color: "bg-green-200",
    // },
    // {
    //   category: "Courses",
    //   desc: "Upgrade your skills",
    //   color: "bg-yellow-200",
    // },
    // { category: "Events", desc: "Find upcoming events", color: "bg-red-200" },
  ];

  const handleTabChange = useCallback(
    (newTab: TabValue) => {
      setActiveTab(newTab);
      router.push(`${pathname}?tab=${newTab}`);
    },
    [router, pathname]
  );

  const handleSelectByPrice = (value: string) => {
    if (value === "All") {
      setSelectedPrices(["All"]); // Select only "All" and clear others
    } else {
      setSelectedPrices((prev) => {
        if (prev.includes("All")) return [value]; // Disable "All" if another is selected

        if (prev.includes(value)) {
          return prev.filter((item) => item !== value); // Deselect option
        } else {
          return [...prev, value]; // Select multiple options
        }
      });
    }
  };

  // Fetch products when the tab changes
  useEffect(() => {
    const courses: any = fetchPopularCourses();
    const fetchAndSetProducts = async () => {
      // const products: any = fetchCourseProducts();
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

    

  }, [activeTab, fetchCourseProducts, fetchPopularCourses]);

  // Listen for changes in the URL to update the active tab
  useEffect(() => {
    const tabFromUrl = (searchParams.get("tab") as TabValue) || "All";
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  fetchListedCourses();

  return (
    <div className="flex gap-4">
      {searchRoom && (
        <div className="w-[20%] min-w-[250px] max-w-[300px] flex flex-col gap-4 p-4 border rounded-md bg-white shadow-sm">
          <h1 className="text-lg font-semibold">Categories</h1>
          <div className="font-medium">Sort by</div>

          {/* Sort Dropdown */}
          <div className="relative w-full">
            <div
              className="flex items-center justify-between p-2 border rounded cursor-pointer bg-gray-50 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedFilter}</span>
              {isDropdownOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>

            {isDropdownOpen && (
              <div className="absolute left-0 w-full mt-2 p-2 border rounded bg-white shadow-md">
                {options.map((option) => (
                  <label
                    key={option.value}
                    className="block p-2 cursor-pointer hover:bg-gray-100 rounded-md"
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedFilter === option.label}
                      onChange={() => handleSelectFactor(option.label)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="flex flex-col mt-2 p-2 border rounded w-full bg-gray-50">
            <h3 className="font-semibold mb-2">Price Filter</h3>
            {priceOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded-md"
              >
                <input
                  type="checkbox"
                  className="accent-blue-500"
                  checked={selectedPrices.includes(option.value)}
                  onChange={() => handleSelectByPrice(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
          {/* Ratings Filter */}
          <div className="relative w-full">
            <div
              className="flex items-center justify-between p-2 border rounded cursor-pointer bg-gray-50 hover:bg-gray-100 mt-4"
              onClick={() => setIsRatingsDropdownOpen(!isRatingsDropdownOpen)}
            >
              <span>
                {selectedRating
                  ? `${selectedRating} Stars`
                  : "Filter by Rating"}
              </span>
              {isRatingsDropdownOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>

            {isRatingsDropdownOpen && (
              <div className="absolute left-0 w-full mt-2 p-2 border rounded bg-white shadow-md">
                {ratingsOptions.map((rating) => (
                  <div
                    key={rating}
                    className="p-2 cursor-pointer hover:bg-gray-100 rounded-md flex items-center gap-2"
                    onClick={() => handleRatingSelect(rating)}
                  >
                    <span>{rating} ⭐</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content (Takes up remaining space) */}
      <div className={`flex-1 ${searchRoom ? "w-[80%]" : "w-full"}`}>
        <div className="w-full">
          <FeaturedProducts
            productCategories={productCategories}
            products={products}
            isSaved={isSaved}
            handleToggleSave={handleToggleSave}
          />
        </div>

        {/* <div className="mt-10 w-full">
          <ExploreCategories
            productCategories={productCategories}
            pathname={pathname}
            handleTabChange={handleTabChange}
          />
        </div> */}

        {/* <div className="mt-10">
          <PopularCourses
            courses={courses}
            isSaved={isSaved}
            handleToggleSave={handleToggleSave}
            item={courses}
          />
        </div> */}
        {/* 
        <div className="mt-10">
          <PopularEvents
            events={events}
            isSaved={isSaved}
            handleToggleSave={handleToggleSave}
            item={events}
          />
        </div> */}
      </div>
    </div>
  );
};

export default MarketPlaceExplore;
