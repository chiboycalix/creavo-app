import React, { useState, useEffect, useCallback, useRef } from "react";
import Socket from "../../../../components/Socket";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AUTH_API } from "@/lib/api";
import { STATUS_CODES } from "@/constants/statusCodes";
import Toastify from "@/components/Toastify";
import { cloudinaryCloudName, cloudinaryUploadPreset } from "@/utils/constant";
import { useWebSocket } from "@/context/WebSocket";

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
  onClose?: () => void;
  onProfileUpdate?: (updatedProfile: UserProfile) => void; 
}

const EditUserInputModal: React.FC<EditUserInputModalProps> = ({
  userProfile,
  onClose,
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
        onClose?.();
      }
    };
    setUser(userProfile);

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [fetchUser, onClose, userProfile]);

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
      console.error("Error updating user data:", error);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
   
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed mx-auto inset-0 h-screen bg-black bg-opacity-50 z-40"
            onClick={() => {
              setOpen(false);
              onClose?.();
            }}
          />
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2  top-10 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-white max-h-[90vh] px-5 overflow-y-auto p-6 rounded-xl shadow-xl mx-4">
              <button
                onClick={() => {
                  setOpen(false);
                  onClose?.();
                }}
                className="absolute top-4 right-10 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Edit Profile
              </h3>
              <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Avatar
                </label>
                <div className="flex items-center gap-3 mt-2">
                  <Image
                    width={80}
                    height={80}
                    src={
                      imagePreview ||
                      user?.profile.avatar ||
                      "/assets/avatar.svg"
                    }
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <div>
                    <button
                      type="button"
                      onClick={handleImageClick}
                      className="px-3 py-1.5 border rounded text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Upload Image
                    </button>
                    <p className="text-gray-500 text-[10px] mt-1.5 max-w-xs">
                      Recommended: 800x800 px. Formats: JPG, PNG, GIF.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    e.preventDefault();
                    setUsername(e.target.value);
                  }}
                  className="w-full px-3 py-2 border rounded focus:outline-none"
                />
                {username && <Socket username={username} />}
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Save Changes"}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
      {alert && <Toastify key="toast" message={alert} />}
    </AnimatePresence>
  );
};

export default EditUserInputModal;