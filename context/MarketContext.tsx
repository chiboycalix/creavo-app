"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import { baseUrl } from "@/utils/constant";
import Cookies from "js-cookie";

export interface Product {
  id: any;
  name: string;
  price: number;
  description: string;
  seller: {
    id: number;
    name: string;
    avatar: string;
  };
}

interface MarketContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  fetchListedCourses: () => void;
  listedCourses: any;
  setListedCourses: React.Dispatch<React.SetStateAction<any>>;
  fetchCourseProducts: () => void;
  fetchPopularCourses: () => void;
  fetchPopularEvents: () => void;
  fetchOrders: () => any;
  fetchMyListings: () => any;
  fetchSavedProducts: () => any;
  savedProducts: any;
  handleToggleSave: (product: any) => void;
  isSaved: boolean;
  setIsSaved: (isSaved: boolean) => void;
  searchRoom: boolean;
  setSearchRoom: (searchRoom: boolean) => void;
  fetchSingleCourseProduct: (id: any) => void;
  showCheckoutCard: boolean;
  setShowCheckoutCard: (showCheckoutCard: boolean) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const useMarketContext = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error("useMarketContext must be used within a MarketProvider");
  }
  return context;
};

interface MarketProviderProps {
  children: ReactNode;
}

export const MarketProvider: React.FC<MarketProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [singleProduct, setSingleProduct] = useState<any>(null);
  const [savedProducts, setSavedProducts] = useState<any>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [searchRoom, setSearchRoom] = useState(false);
  const [showCheckoutCard, setShowCheckoutCard] = useState(false);
  const [listedCourses, setListedCourses] = useState<any>(null);
  const { getCurrentUser } = useAuth();
  const userId = getCurrentUser()?.id;

  const fetchCourseProducts = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/market-place/courses/list-courses?limit=10&category=STANDARD&page=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      const courseProducts = data?.data?.courses;
      return courseProducts;
    } catch (error) {}
  }, []);

  const fetchSingleCourseProduct = async (id: any) => {
    try {
      const response = await fetch(`${baseUrl}/market-place/courses/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      const course = data?.data;
      return course;
    } catch (error) {}
  };

  const fetchPopularCourses = () => {
    return [
      {
        id: "1",
        title: "Build it in Figma: Design system for beginners",
        description: "A complete UI/UX design course for beginners.",
        price: 0,
        numberOfParticipants: 205,
        category: "Courses",
        seller: {
          id: "101",
          name: "Designer Pro",
          avatar: "/assets/dummyCourse.png",
        },
      },
      {
        id: "2",
        title: "Advanced JavaScript Concepts",
        description: "Deep dive into advanced JavaScript topics.",
        price: 0,
        numberOfParticipants: 150,
        category: "Programming",
        seller: {
          id: "102",
          name: "Code Master",
          avatar: "/assets/dummyCourse.png",
        },
      },
      {
        id: "3",
        title: "Mastering React",
        description: "Learn React from basics to advanced level.",
        price: 49,
        numberOfParticipants: 300,
        category: "Programming",
        seller: {
          id: "103",
          name: "React Guru",
          avatar: "/assets/dummyCourse.png",
        },
      },
      {
        id: "4",
        title: "Digital Marketing 101",
        description: "Introduction to digital marketing strategies.",
        price: 25,
        numberOfParticipants: 180,
        category: "Marketing",
        seller: {
          id: "104",
          name: "Marketing Expert",
          avatar: "/assets/dummyCourse.png",
        },
      },
      {
        id: "5",
        title: "Photography for Beginners",
        description: "Learn the basics of photography.",
        price: 35,
        numberOfParticipants: 220,
        category: "Photography",
        seller: {
          id: "105",
          name: "Photo Pro",
          avatar: "/assets/dummyCourse.png",
        },
      },
    ];
  };

  const fetchPopularEvents = () => {
    return [
      {
        id: "1",
        title: "Tech Conference 2025",
        description: "Join the biggest tech event of the year.",
        price: 199,
        numberOfParticipants: 500,
        category: "Technology",
        seller: {
          id: "101",
          name: "Tech Events Ltd.",
          avatar: "/assets/dummyCourse.png",
        },
      },
      {
        id: "2",
        title: "Startup Networking Night",
        description: "Connect with entrepreneurs and investors.",
        price: 30,
        numberOfParticipants: 100,
        category: "Business",
        seller: {
          id: "102",
          name: "Startup Connect",
          avatar: "/assets/dummyCourse.png",
        },
      },
      {
        id: "3",
        title: "Music Festival 2025",
        description: "Experience live music with top artists.",
        price: 120,
        numberOfParticipants: 300,
        category: "Music",
        seller: {
          id: "103",
          name: "Music World",
          avatar: "/assets/dummyCourse.png",
        },
      },
    ];
  };

  const fetchMyListings = () => {
    return [
      {
        id: "1",
        title: "UI Design Kit",
        description: "A complete UI/UX design template pack.",
        price: 29,
        rating: 4.5,
        category: "Courses",
        seller: {
          id: "101",
          name: "Designer Pro",
          avatar: "/assets/dummyImage.png",
        },
      },
      {
        id: "2",
        title: "Website Template",
        description: "Fully responsive website template.",
        price: 49,
        rating: 4.8,
        category: "Digital Products",
        seller: {
          id: "102",
          name: "Web Solutions",
          avatar: "/assets/dummyImage.png",
        },
      },
      {
        id: "3",
        title: "Social Media Icons Pack",
        description: "Custom social media icons for brands.",
        price: 19,
        rating: 4.2,
        category: "Digital Products",
        seller: {
          id: "103",
          name: "Graphic Master",
          avatar: "/assets/dummyImage.png",
        },
      },

      // E-Books
      {
        id: "4",
        title: "Digital Marketing Guide",
        description: "Step-by-step guide to digital marketing.",
        price: 15,
        rating: 4.6,
        category: "Courses",
        seller: {
          id: "104",
          name: "Marketing Guru",
          avatar: "/assets/dummyImage.png",
        },
      },
      {
        id: "5",
        title: "Python for Beginners",
        description: "Learn Python programming from scratch.",
        price: 25,
        rating: 4.9,
        category: "Courses",
        seller: {
          id: "105",
          name: "Code Academy",
          avatar: "/assets/dummyImage.png",
        },
      },
    ];
  };

  const fetchOrders = () => {
    return [
      {
        id: "2",
        title: "Website Template",
        description: "Fully responsive website template.",
        price: 49,
        rating: 4.8,
        category: "Courses",
        seller: {
          id: "102",
          name: "Web Solutions",
          avatar: "/assets/dummyImage.png",
        },
      },
      {
        id: "3",
        title: "Social Media Icons Pack",
        description: "Custom social media icons for brands.",
        price: 19,
        rating: 4.2,
        category: "Courses",
        seller: {
          id: "103",
          name: "Graphic Master",
          avatar: "/assets/dummyImage.png",
        },
      },

      // E-Books
      {
        id: "4",
        title: "Digital Marketing Guide",
        description: "Step-by-step guide to digital marketing.",
        price: 15,
        rating: 4.6,
        category: "Courses",
        seller: {
          id: "104",
          name: "Marketing Guru",
          avatar: "/assets/dummyImage.png",
        },
      },
      // Courses
      {
        id: "8",
        title: "Photography Basics",
        description: "Improve your photography skills.",
        price: 50,
        rating: 4.3,
        category: "Courses",
        seller: {
          id: "108",
          name: "Photo Academy",
          avatar: "/assets/dummyImage.png",
        },
      },
      {
        id: "9",
        title: "Business Strategy 101",
        description: "Learn effective business strategies.",
        price: 65,
        rating: 4.6,
        category: "Courses",
        seller: {
          id: "109",
          name: "Business Coach",
          avatar: "/assets/dummyImage.png",
        },
      },

      // Events
      {
        id: "10",
        title: "Tech Conference 2025",
        description: "Join the biggest tech event of the year.",
        price: 199,
        rating: 5.0,
        category: "Events",
        seller: {
          id: "110",
          name: "Tech Events Ltd.",
          avatar: "/assets/dummyImage.png",
        },
      },
      {
        id: "11",
        title: "Music Festival Ticket",
        description: "Experience live music with top artists.",
        price: 120,
        rating: 4.7,
        category: "Events",
        seller: {
          id: "111",
          name: "Music World",
          avatar: "/assets/dummyImage.png",
        },
      },
      // Services
      {
        id: "13",
        title: "Logo Design Service",
        description: "Professional logo design for your brand.",
        price: 99,
        rating: 4.8,
        category: "Services",
        seller: {
          id: "113",
          name: "Creative Studio",
          avatar: "/assets/dummyImage.png",
        },
      },
      {
        id: "14",
        title: "SEO Optimization",
        description: "Boost your website’s ranking.",
        price: 120,
        rating: 4.9,
        category: "Services",
        seller: {
          id: "114",
          name: "SEO Experts",
          avatar: "/assets/dummyImage.png",
        },
      },
    ];
  };

  const fetchSavedProducts = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/users/${userId}/saved-courses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      const courseProducts = data?.data?.courses;
      return courseProducts;
    } catch (error) {}
  }, [userId]);

  const handleToggleSave = useCallback(
    async (product: any) => {
      const isCurrentlySaved = savedProducts?.some(
        (p: Product) => p.id == product?.id
      );

      // Optimistically update savedProducts
      const previousSaved = [...savedProducts];
      let newSaved;

      console.log("id", product?.id);
      console.log("pro pro", product);

      if (!isCurrentlySaved) {
        newSaved = [...savedProducts, product];
        setSavedProducts(newSaved);

        try {
          const response = await fetch(
            `${baseUrl}/market-place/courses/save-course`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("accessToken")}`,
              },
              body: JSON.stringify({
                interactableId: product?.id,
                interactableType: "COURSE",
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to save course");
          }
        } catch (error) {
          console.error(error);
          setSavedProducts(previousSaved);
        }
      } else {
        newSaved = savedProducts?.filter((p: any) => p.id != product?.id);
        setSavedProducts(newSaved);

        try {
          const response = await fetch(
            `${baseUrl}/market-place/courses/${product?.id}/delete-save-course`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("accessToken")}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to unsave course");
          }
        } catch (error) {
          console.error(error);
          setSavedProducts(previousSaved);
        }
      }
    },
    [savedProducts, setSavedProducts]
  );

  const fetchListedCourses = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/users/${userId}/courses?page=1&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      const promoCourses = data?.data.courses
      // .filter(
      //   (course: any) => course.promote === true
      // );
      return promoCourses;
    } catch (error) {}
  }, [userId]);

  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await fetchListedCourses();
      setListedCourses(courses);
    };

    fetchCourses();
  }, [fetchListedCourses]);

  useEffect(() => {
    const getProducts = async () => {
      const products = await fetchCourseProducts();
      setProducts(products);
    };
    getProducts();
  }, [fetchCourseProducts]);

  useEffect(() => {
    const getSavedProducts = async () => {
      const products = await fetchSavedProducts();
      setSavedProducts(products);
    };

    getSavedProducts(); 
  }, [fetchSavedProducts]);

  return (
    <MarketContext.Provider
      value={{
        products,
        setProducts,
        fetchCourseProducts,
        fetchListedCourses,
        fetchSingleCourseProduct,
        fetchSavedProducts,
        listedCourses,
        setListedCourses,
        fetchPopularCourses,
        fetchPopularEvents,
        fetchOrders,
        fetchMyListings,
        savedProducts,
        handleToggleSave,
        isSaved,
        setIsSaved,
        searchRoom,
        setSearchRoom,
        showCheckoutCard,
        setShowCheckoutCard,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};
