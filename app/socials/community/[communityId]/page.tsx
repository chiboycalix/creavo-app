"use client"
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SpacePage() {

  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className="w-full">
        <div className="p-4 py-10 bg-gray-100 w-[50%] mx-auto mt-20 rounded-md flex items-center flex-col">
          <p>Looks like you don&apos;t have a space yet</p>
          <p>Create a space</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}