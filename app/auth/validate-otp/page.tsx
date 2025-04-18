'use client';

import React, {
  useState,
  FormEvent,
  useEffect,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AUTH_API } from "@/lib/api/auth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function OtpContent() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const email = queryParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300);
  const [isResending, setIsResending] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const { setAuth } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsVerifyingOtp(true)
    try {
      const data = (await AUTH_API.validateOTP({
        token: otp
      })) as any;

      console.log("data", data);

      if (data.code === 200) {
        showToast(
          'success',
          "Validate OTP",
          data.message
        );
        setAuth(true, data?.data, data?.data?.token?.token);
        router.push(`/auth/welcome?email=${email}`);
      } else {
        showToast(
          'error',
          "An error occurred",
          data.message
        );
      }
    } catch (error: any) {
      showToast(
        'error',
        "Something went wrong",
        error.message
      );
    } finally {
      setIsVerifyingOtp(false)
    }
  };

  const handleResendOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsResending(true)
    try {
      const data = (await AUTH_API.resendOTP(email)) as any;

      if (data.code === 200) {
        showToast(
          'success',
          "Resend OTP",
          data.message
        );
      } else {
        showToast(
          'error',
          "An error occurred",
          data.message
        );
      }
    } catch (error: any) {
      showToast(
        'error',
        "Something went wrong",
        error.message
      );
    } finally {
      setIsResending(false)
    }
  };

  useEffect(() => {
    let countdown: NodeJS.Timeout | null = null;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (countdown) clearInterval(countdown);
    };
  }, [timer]);

  return (
    <div className="max-w-lg mx-auto w-full">

      <div className="w-full bg-white">
        <div className="w-full">
          <p className="font-semibold text-center">Hey, {email} </p>
          <p className="text-center text-sm mt-3">An OTP has been sent to your email, please enter the 6 digits below</p>
          <form onSubmit={handleSubmit} className="w-full">
            <section className="w-full mt-6 sm:mt-8 md:mt-10">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                className="rounded-none"
              >
                <InputOTPGroup className="w-full flex gap-1 sm:gap-2 justify-between rounded-none">
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="w-20 h-20 border text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold rounded-none"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <div className="mt-4">
                <Button
                  type="submit"
                  className="bg-primary border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
                >
                  {
                    isVerifyingOtp ? <Loader2 className="text-white animate-spin" size={60} /> : "Confirm"
                  }
                </Button>
                <div className="flex justify-end mt-2">
                  <Button
                    variant={"link"}
                    className="flex gap-1 text-xs sm:text-sm text-primary cursor-pointer"
                    onClick={(e) => handleResendOtp(e)}
                  >

                    Resend OTP
                  </Button>
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}