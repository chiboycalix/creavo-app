"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/Input";
import { useRouter } from "next/navigation.js";
import { baseUrl } from "@/utils/constant";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          triggerEvent: "confirm-reset-password",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        showToast(
          'success',
          "Forgot Password",
          data.message
        );
        router.push(`/auth/reset-password?email=${email}`);
      } else {
        showToast(
          'error',
          "An error occured",
          data.message
        );
      }
    } catch (error: any) {
      showToast(
        'error',
        "Something went wrong",
        error.message
      );
    }
  };

  return (
    <div className="flex-1 max-w-md mx-auto w-full">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="font-bold text-2xl">Forgot Password?</h1>
        </div>
        <p className="text-center text-sm">Enter your email address and we&apos;ll send you instructions to reset your password.</p>
        <div className="w-full mt-3">
          <form
            onSubmit={handleSubmit}
            className="mx-auto mb-0 mt-1 w-full space-y-3"
          >
            <Input
              leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
              label="Email"
              variant="text"
              id="email"
              name="email"
              placeholder="johndoe@strides.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />

            <Button
              type="submit"
              className="bg-primary h-[50px] border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
            >
              Send OTP
            </Button>
          </form>

          <div className="text-center mt-8">
            <Link
              href="/auth?tab=signin"
              className="text-sm text-primary hover:text-primary-500 font-semibold"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div >
  );
}
