"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UploadInput } from "@/components/Input/UploadInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Upload() {

  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className="min-h-[85vh] w-full flex justify-center items-center">
        <div className="w-10/12">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">

              </CardTitle>
              <CardContent>
                <div className="mb-4">
                  <h2>File Upload</h2>
                  <p className="text-sm">Add your documents here,  you can upload up to 3 posts at a time</p>
                </div>
                <UploadInput
                  label="Upload Media"
                  maxFiles={5}
                  accept="image/*,video/*"
                  className="mb-6"
                  nextPath="/socials/edit-post"
                />
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
