"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface Product {
  id: number;
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
  addProduct: (product: Product) => void;
  removeProduct: (id: number) => void;
  fetchProducts: () => void;
  fetchPopularCourses: () => void;
  fetchPopularEvents: () => void;
  savedProducts: any;
  handleToggleSave: (product: any) => void;
  isSaved: boolean;
  setIsSaved: (isSaved: boolean) => void;
  searchRoom: boolean;
  setSearchRoom: (searchRoom: boolean) => void;
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
  const [savedProducts, setSavedProducts] = useState<any>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [searchRoom, setSearchRoom] = useState(false);

  const fetchProducts = () => {
    return [
      {
        id: "1",
        title: "UI Design Kit",
        description: "A complete UI/UX design template pack.",
        price: 29,
        rating: 4.5,
        category: "Digital Products",
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
        category: "E-Books",
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
        category: "E-Books",
        seller: {
          id: "105",
          name: "Code Academy",
          avatar: "/assets/dummyImage.png",
        },
      },
      {
        id: "6",
        title: "Startup Handbook",
        description: "Essential guide for building a startup.",
        price: 20,
        rating: 4.7,
        category: "E-Books",
        seller: {
          id: "106",
          name: "Entrepreneur Hub",
          avatar: "/assets/dummyImage.png",
        },
      },

      // Courses
      {
        id: "7",
        title: "React JS Masterclass",
        description: "Learn React from basics to advanced level.",
        price: 79,
        rating: 4.9,
        category: "Courses",
        seller: {
          id: "107",
          name: "Tech Mentor",
          avatar: "/assets/dummyImage.png",
        },
      },
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
      {
        id: "12",
        title: "Startup Networking Night",
        description: "Connect with entrepreneurs and investors.",
        price: 30,
        rating: 4.4,
        category: "Events",
        seller: {
          id: "112",
          name: "Startup Connect",
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
      {
        id: "15",
        title: "Video Editing",
        description: "High-quality video editing service.",
        price: 150,
        rating: 4.7,
        category: "Services",
        seller: {
          id: "115",
          name: "Media Pro",
          avatar: "/assets/dummyImage.png",
        },
      },
    ];
  };

  const fetchPopularCourses = () => {
    return [
      {
        id: "1",
        title: "Build it in Figma: Design system for beginners",
        description: "A complete UI/UX design course for beginners.",
        price: 0,
        numberOfParticipants: 205,
        category: "Digital Products",
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

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const removeProduct = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  const handleToggleSave = useCallback((product: Product) => {
    setSavedProducts((prevSavedProducts: any) => {
      const isCurrentlySaved = prevSavedProducts.some(
        (p: Product) => p.id === product.id
      );

      if (isCurrentlySaved) {
        setIsSaved(false); // Product is being removed
        return prevSavedProducts.filter((p: Product) => p.id !== product.id);
      } else {
        setIsSaved(true); // Product is being saved
        return [...prevSavedProducts, product];
      }
    });
  }, []);

  return (
    <MarketContext.Provider
      value={{
        products,
        fetchProducts,
        fetchPopularCourses,
        fetchPopularEvents,
        addProduct,
        removeProduct,
        savedProducts,
        handleToggleSave,
        isSaved,
        setIsSaved,
        searchRoom,
        setSearchRoom,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};
