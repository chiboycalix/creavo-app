import React, { useState, useEffect, useCallback, useRef } from "react";
import Socket from "@/components/Socket";
import Image from "next/image";
import Toastify from "@/components/Toastify";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AUTH_API } from "@/lib/api";
import { STATUS_CODES } from "@/constants/statusCodes";
import { cloudinaryCloudName, cloudinaryUploadPreset } from "@/utils/constant";
import { useWebSocket } from "@/context/WebSocket";
import { Input } from "@/components/Input";
import { TextareaInput } from "@/components/Input/TextareaInput";
import { Loader2 } from "lucide-react";

interface UserProfile {
  id: number;
  username: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
  };
}

interface EditUserInputModalProps {
  userProfile: UserProfile & { profile?: UserProfile["profile"] };
  onProfileUpdate?: (updatedProfile: UserProfile) => void;
}

const EditUserProfileModal: React.FC<EditUserInputModalProps> = ({
  userProfile,
  onProfileUpdate
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [alert, setAlert] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ws = useWebSocket();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const fetchUser = useCallback(() => {
    setUser(userProfile);
    setFirstName(userProfile.profile.firstName || "");
    setLastName(userProfile.profile.lastName || "");
    setUsername(userProfile.username || "");
    setBio(userProfile.profile.bio || "");
    setLoading(false);
  }, [userProfile]);

  useEffect(() => {
    fetchUser();

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    setUser(userProfile);

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [fetchUser, userProfile]);

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryUploadPreset || "");
    formData.append("cloud_name", cloudinaryCloudName || "");
    formData.append("folder", "Stridez/profiles");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`,
      { method: "POST", body: formData }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = user?.profile.avatar;
      if (selectedImage) {
        imageUrl = await uploadImageToCloudinary(selectedImage);
      }

      const updatedUserData = {
        avatar: imageUrl,
        firstName,
        lastName,
        username,
        bio,
      };

      const response = (await AUTH_API.updateProfile(updatedUserData)) as any;
      if (response.code !== STATUS_CODES.OK) {
        return;
      }

      setAlert("Update was successful");
      setLoading(false);

      setUser((prev) => {
        if (!prev) return null;
        return {
          id: prev.id,
          username: username,
          profile: {
            firstName: firstName,
            lastName: lastName,
            avatar: imageUrl || prev.profile.avatar,
            bio: bio
          }
        };
      });

      setOpen(false);

      ws?.emit("profileUpdated", updatedUserData);

      if (onProfileUpdate && user) {
        onProfileUpdate({
          id: user.id,
          username: username,
          profile: {
            firstName: firstName,
            lastName: lastName,
            avatar: imageUrl || user.profile.avatar,
            bio: bio
          }
        });
      }

    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <>
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div className="flex justify-between items-center gap-3 mt-2 bg-white border rounded-md p-4">
            <div className="flex items-center gap-4">
              <img
                src={
                  imagePreview ||
                  user?.profile.avatar ||
                  "/assets/avatar.svg"
                }
                alt="Profile Preview"
                className="rounded-full object-cover w-12 h-12"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-black">{userProfile?.profile?.firstName} {userProfile?.profile?.lastName}</span>
                <span className="text-sm text-gray-600">@{username}</span>
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
              <Button
                type="button"
                onClick={handleImageClick}
                className="px-6 py-0 border rounded-md text-xs"
              >
                Change Image
              </Button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md">
            <div className="mb-4">
              <Input
                label="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <Input
                label="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />

              {/* {username && <Socket username={username} />} */}
            </div>
            <div className="mb-8">
              <TextareaInput
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-white rounded-lg font-medium focus:outline-none  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? <Loader2 color="white" /> : "Save Changes"}
            </Button>
          </div>

        </form>
      </>
      {alert && <Toastify key="toast" message={alert} />}
    </AnimatePresence>
  );
};

export default EditUserProfileModal;