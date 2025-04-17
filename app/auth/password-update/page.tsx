"use client";

import React, { useState } from "react";
import { Input } from "@/components/Input";
import { useRouter, useSearchParams } from "next/navigation";
import { baseUrl } from "@/utils/constant";
import { LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import Cookies from "js-cookie";

const MIN_PASSWORD_LENGTH = 8

const PasswordUpdate = () => {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const queryParams = useSearchParams();
  const tempToken = queryParams.get("otp");
  const router = useRouter();
  const { showToast } = useToast();

  console.log("tempToken", tempToken);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password1 !== password2) {
      showToast(
        'error',
        "Password Update",
        "Passwords do not match"
      );

      return;
    }
    if (password1.length < MIN_PASSWORD_LENGTH) {
      showToast(
        'error',
        "Password Update",
        `Passwords length must be atleast ${MIN_PASSWORD_LENGTH}`
      );
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/auth/confirm-reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password1,
          confirmPassword: password2,
          token: tempToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(
          'success',
          "Password Update",
          data.message
        );
        router.push(`/auth/reset-success?email=${data.data.email}`);
      } else {
        showToast(
          'error',
          "Password Update",
          data.message || "Failed to update password. Please try again."
        );
      }
    } catch (error: any) {
      showToast(
        'error',
        "Password Update",
        error.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="flex-1 max-w-md mx-auto w-full">
      <div className="w-full">
        <h2 className="font-bold text-3xl py-4 text-center">Update Password</h2>
        <div className="gap-y-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              leftIcon={<LockIcon className="h-5 w-5 text-gray-400" />}
              label="Password"
              variant="password"
              placeholder="*****"
              value={password1}
              id="password1"
              name="password1"
              onChange={(e) => setPassword1(e.target.value)}
            />

            <div>
              <Input
                leftIcon={<LockIcon className="h-5 w-5 text-gray-400" />}
                label="Confirm Password"
                variant="password"
                placeholder="*****"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                id="password2"
                name="password2"
              />
              {password2 && password1 !== password2 && (
                <p className="text-red-500 text-sm mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            <Button type="submit" className="bg-primary h-[50px] border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6">
              Save Password
            </Button>
            <p className=" text-center py-4">
              This will be your new password to sign in to crevoe
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdate;
