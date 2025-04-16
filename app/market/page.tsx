"use client";
import React, { useEffect } from "react";
import MarketPlaceExplore from "./explore/_components/MarketPlaceExplore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import { TourProvider } from "@/context/TourContext"
import Tour from "@/components/socials/tour/tour"
import { marketTourSteps } from "@/tour/marketTour";
import TourButton from "@/components/socials/tour/tour-button"

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
       <TourProvider
            steps={marketTourSteps}
            tourKey="marketTourProgress"
            autoStart={true}
            startDelay={1000}
            // onComplete={handleTourComplete}
          >
              <Tour />
              {/* <TourButton/> */}
      
      <MarketPlaceExplore />
      </TourProvider>
    </div>
  );
};

export default MarketPlace;
