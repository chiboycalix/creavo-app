"use client"
import { useState, useEffect } from "react"
import UserBookmarks from "./UserBookmarks"
import { apiClient } from "@/lib/apiClient"

export default function BookmarkApp() {
  const [userId, setUserId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await apiClient.get("/auth/me")
        if (response.data?.id) {
          setUserId(response.data.id)
          console.log("User ID:", response.data.id)
        } else {
          throw new Error("Invalid user data response")
        }
      } catch (err) {
        console.error("Error fetching user ID:", err)
        setError("Failed to load user data. Please try again.")
      }
    }

    fetchUserId()
  }, [])

  return (
    <div className="mx-auto py-8 px-4">

      <div className="w-full mx-auto">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : userId ? (
          <UserBookmarks userId={userId} initialLimit={10} />
        ) : (
          <p className="text-gray-500 text-center">Loading...</p>
        )}
      </div>
    </div>
  )
}

