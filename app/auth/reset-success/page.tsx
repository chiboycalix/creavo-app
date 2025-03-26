'use client';

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomeContent() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const email = queryParams.get("email") || "";
  const { getCurrentUser, isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSetupProfile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(`/auth?tab=signin`);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.SIGN_IN);
    }
  }, [getCurrentUser, isAuthenticated, router]);


  if (!mounted) {
    return null
  }

  return (
    <div className="flex-1 flex flex-col items-center w-full">
      <div className="h-24 w-24">
        <img src={"/assets/Congrats.png"} alt="congrats" />
      </div>

      <div className="flex flex-col justify-center items-center gap-3 text-pretty ">
        <p className="font-bold text-xl mb-1">Hey, {email} </p>
        <p className=" text-center text-sm">
        Successful! Your new password has been successfully saved. 
        </p>

        <div className="w-1/2 mt-4">
          <Button
            onClick={(e)=>handleSetupProfile(e)}
            type="button"
            className="bg-primary h-[50px] border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
          >
            Proceed to login
          </Button>
        </div>
      </div>
    </div>
  )
}