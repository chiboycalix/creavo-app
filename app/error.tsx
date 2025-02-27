"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.log("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600">Something Went Wrong</h1>
        <p className="mt-2 text-gray-600">{error.message}</p>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-4 text-sm text-gray-500">{error.stack}</pre>
        )}
        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}