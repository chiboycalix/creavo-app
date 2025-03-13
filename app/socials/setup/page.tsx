"use client"

import { useState, useRef, useEffect, type ChangeEvent, type FormEvent, useCallback } from "react"
import Socket from "@/components/Socket"
import { useWebSocket } from "@/context/WebSocket"
import { useAuth } from "@/context/AuthContext"
import { BsX } from "react-icons/bs"
import Toastify from "@/components/Toastify"
import Link from "next/link"
import Spinner from "@/components/Spinner"
import { useRouter } from "next/navigation"
import { baseUrl, cloudinaryCloudName, cloudinaryUploadPreset } from "@/utils/constant"
import Cookies from "js-cookie"
import { ROUTES } from "@/constants/routes"
import { STATUS_CODES } from "@/constants/statusCodes"

const ProfileSetup = () => {
  const {  getCurrentUser, } = useAuth()
  const ws = useWebSocket()
  const user = getCurrentUser()
  const router = useRouter()

  const [firstName, setFirstName] = useState<string>(user?.profile?.firstName || "")
  const [lastName, setLastName] = useState<string>(user?.profile?.lastName || "")
  const [bio, setBio] = useState<string>(user?.profile?.bio || "")
  const [username, setUsername] = useState<string>(user?.username || "")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(user?.profile?.avatar || null)
  const [alert, setAlert] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

 
  const initializeUserData = useCallback(() => {
    if (user) {
      setFirstName(user?.firstName || "")
      setLastName(user.lastName || "")
      setUsername(user.username || "")
      setBio(user?.bio || "")
      setImagePreview(user.avatar || "Stridez/profile-images")
    }
  }, [user])

  useEffect(() => {
    initializeUserData()
  }, [initializeUserData])

  useEffect(() => {
    if (ws && user?.id) {
      const handleProfileUpdate = (updatedData: any) => {
        if (updatedData) {
          setFirstName(updatedData.profile.firstName || firstName)
          setLastName(updatedData.lastName || lastName)
          setUsername(updatedData.username || username)
          setBio(updatedData.bio || bio)
          if (updatedData.avatar) {
            setImagePreview(updatedData.avatar)
          }
          setAlert("Profile updated from another device")
        }
      }

      ws.on(`profile_updated_${user.id}`, handleProfileUpdate)

      return () => {
        ws.off(`profile_updated_${user.id}`, handleProfileUpdate)
      }
    }
  }, [ws, user?.id, firstName, lastName, username, bio])

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", cloudinaryUploadPreset || "")
    formData.append("cloud_name", cloudinaryCloudName || "")
    formData.append("folder", "Stridez/profile-images")

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const data = await response.json()
    return data.secure_url
  }

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = user?.profile?.avatar || ""
      if (selectedImage) {
        imageUrl = await uploadImageToCloudinary(selectedImage)
      }

      const updatedUserData = {
        firstName,
        lastName,
        username,
        bio,
        avatar: imageUrl,
      }

      const response = await fetch(`${baseUrl}/profiles`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      })

      const result = await response.json()

      if (response.status !== STATUS_CODES.OK) {
        setAlert(result.message || "Failed to update profile")
        setLoading(false)
        return
      }

      setAlert("Profile updated successfully!")

      // Update local user data
      const updatedProfile = {
        id: user?.id,
        username: username,
        profile: {
          firstName: firstName,
          lastName: lastName,
          avatar: imageUrl,
          bio: bio,
        },
      }

      ws?.emit("profileUpdated", updatedUserData)


      router.push(ROUTES.SELECT_INTERESTS)
    } catch (error) {
      setAlert("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toastify message={alert} />
      <button className="fixed top-7 right-7 p-1.5 bg-slate-100 rounded-full">
        <BsX className="text-xl" />
      </button>
      <div className="flex flex-col lg:flex-row max-h-screen p-3 lg:gap-20 bg-white rounded-lg">
        {/* Profile Setup Header */}
        <div className="w-full lg:w-5/12 relative">
          <img
            src="/assets/profilepix.png"
            alt="Profile Setup"
            className="w-full h-64 lg:h-full object-cover rounded-lg"
          />
          <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black to-transparent rounded-b-lg">
            <h2 className="text-white text-3xl font-medium">Set up your profile</h2>
          </div>
        </div>

        {/* Profile Setup Form */}
        <div
          className="w-full px-4 lg:px-16 flex-1 flex justify-center rounded-lg overflow-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="max-w-[40rem] py-3">
            <h2 className="text-3xl font-semibold my-4">Set up your profile</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="flex justify-between items-center gap-3 mt-2 bg-white border rounded-md p-4 mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={imagePreview || "/assets/userpix.png"}
                    alt="Profile Preview"
                    className="rounded-full object-cover w-12 h-12"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-black">
                      {firstName || "First"} {lastName || "Last"}
                    </span>
                    <span className="text-sm text-gray-600">@{username || "username"}</span>
                  </div>
                </div>

                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="px-6 py-2 border rounded-md text-xs bg-transparent hover:bg-gray-100"
                  >
                    Change Image
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="bg-white p-4 rounded-md border">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">First Name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-sm border rounded py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="First name"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Last Name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-sm border rounded py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Last name"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-sm border rounded py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Create your username"
                  />
                  {username && <Socket username={username} />}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full text-sm border rounded py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                    placeholder="Short bio"
                    rows={4}
                  />
                </div>

                {/* Submit and Skip Buttons */}
                <div className="flex flex-col items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#37169C] hover:bg-[#37169C]/85 text-white font-medium py-2.5 text-sm px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {loading ? <Spinner /> : "Save and Continue"}
                  </button>
                  <button
                    type="button"
                    className="w-full mt-3 text-gray-500 text-sm border border-gray-300 py-2.5 hover:bg-gray-200 rounded-sm transition-colors"
                  >
                    <Link href={ROUTES.SELECT_INTERESTS}>Skip for now</Link>
                  </button>
                </div>
              </div>
            </form>

            {/* Skip Info */}
            <p className="w-full text-gray-500 text-xs mt-2 text-center lg:text-left mb-6">
              You can skip this process now and complete your profile setup later in the profile settings.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileSetup

