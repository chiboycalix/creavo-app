"use client";
import React, { useEffect } from "react";
import MarketPlaceExplore from "./explore/_components/MarketPlaceExplore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";

const MarketPlace = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.SIGN_IN);
    }
  }, [isAuthenticated, router]);
  return (
    <div>
      <MarketPlaceExplore />
    </div>
  );
};

export default MarketPlace;
