"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  // Add other product properties as needed
}

interface MarketContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: number) => void;
  fetchProducts: () => void;
  savedProducts: any;
  handleToggleSave: (product: any) => void;
  isSaved: boolean;
  setIsSaved: (isSaved: boolean) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const useMarketContext = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
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

  const fetchProducts = async () => {
    const dummyProducts = Array.from({ length: 10 }, (_, index) => ({
      id: (index + 1).toString(),
      title: `Product Title ${index + 1}`,
      description: `Description for product ${index + 1}`,
      price: Math.floor(Math.random() * 100) + 1,
      rating: (Math.random() * 5).toFixed(1),
      category: [
        "Digital Products",
        "E-Books",
        "Courses",
        "Events",
        "Services",
      ][Math.floor(Math.random() * 5)],
      seller: {
        id: (index + 1).toString(),
        name: `Seller ${index + 1}`,
        avatar: "/assets/dummyImage.png",
      },
    }));

    return dummyProducts;
  };

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const removeProduct = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  const addSavedProduct = (productId: any) => {
    setSavedProducts([...savedProducts, productId]);
  };

  const handleToggleSave = (product: any) => {
    console.log("product", product);
    if (savedProducts?.includes(product.id)) {
      setSavedProducts(savedProducts?.filter((id: any) => id !== product.id));
      setIsSaved(false);
    } else {
      setSavedProducts([...savedProducts, product]);
      setIsSaved(true);
    }

    console.log("saved products", savedProducts);
  };

  return (
    <MarketContext.Provider
      value={{ products, addProduct, removeProduct, fetchProducts, savedProducts, handleToggleSave, isSaved, setIsSaved }}
    >
      {children}
    </MarketContext.Provider>
  );
};
