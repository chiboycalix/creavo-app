"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UploadInput } from "@/components/Input/UploadInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Upload() {
  const router = useRouter()
  const handleUploadComplete = (urls: string[]) => {
    console.log("Uploaded URLs:", urls);
    // Navigate or perform other actions with the URLs
    // /socials/edit-post
    router.push("/socials/edit-post")

  };

  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className="min-h-[85vh] w-9/12 mx-auto flex justify-center items-center">
        <div className="w-10/12">
          <Card className="border-none rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">

              </CardTitle>
              <CardContent>
                <div className="mb-4">
                  <h2 className="mb-1">Upload post</h2>
                  <p className="text-sm">Add your videos/pictures here</p>
                </div>
                <UploadInput
                  label=""
                  maxFiles={5}
                  accept="image/*,video/*"
                  className="p-2 py-10"
                  nextPath="/socials/edit-post"
                  onChange={(upload) => {

                  }}
                />
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
