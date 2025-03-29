"use client";
import Cookies from "js-cookie";
import ButtonLoader from "@/components/ButtonLoader";
import Link from "next/link";
import React, {
  useState,
  useRef,
  useEffect,
  FormEvent,
} from "react";
import Socket from "@/components/Socket";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/utils/constant";
import { ROUTES } from "@/constants/routes";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import { TextareaInput } from "@/components/Input/TextareaInput";
import { User, X } from "lucide-react";
import { uploadImageToCloudinary } from "@/utils";
import { useToast } from "@/context/ToastContext";
import { updateProfileService } from "@/services/profile.service";

const ProfileSetup = () => {
  const { getAuth, currentUser } = useAuth();
  const user = currentUser;
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser?.id);
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>(
    profileData?.data?.profile?.firstName || ""
  );
  const [lastName, setLastName] = useState<string>(
    profileData?.data?.profile?.lastName || ""
  );
  const [bio, setBio] = useState<string>(profileData?.data?.profile?.bio || "");
  const [username, setUsername] = useState<string>(user?.username || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!getAuth()) router.push("/auth");
  }, [getAuth, router, user]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  console.log({ profileData })
  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const avatarUrl = selectedImage ? await uploadImageToCloudinary(selectedImage) : undefined;

    const requestPayload = {
      firstName,
      lastName,
      username,
      bio,
      avatar: avatarUrl || profileData?.data?.profile?.avatar,
    };

    try {
      await updateProfileService(requestPayload)
      setLoading(false);

      showToast(
        'success',
        "Profile Setup",
        "Profile updated successfully!"
      );
      router.push(ROUTES.SELECT_INTERESTS);
    } catch (error) {
      showToast(
        'error',
        "Profile Setup",
        "Failed to update profile"
      );

      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const defaultAvatar = "https://i.postimg.cc/Bv2nscWb/icon-default-avatar.png";

  // Determine the avatar URL to use
  const urlAvatar = profileLoading
    ? defaultAvatar // Show default while loading
    : profileData?.data?.profile?.avatar || defaultAvatar;

  return (
    <>
      <div className=" bg-white rounded-lg">
        <div className="py-3">
          <h2 className="text-3xl font-semibold my-4">Set up your profile</h2>

          <form onSubmit={handleUpdateProfile}>
            {/* Avatar Upload */}
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-medium">
                Avatar
              </label>
              <div className="flex items-center gap-3 py-3">
                <img
                  src={imagePreview || urlAvatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full bg-blue-200"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <div>
                  <Button
                    type="button"
                    onClick={handleImageClick}
                    className="px-6 py-0 border rounded-md text-xs broder border-primary-100"
                    variant={"outline"}
                  >
                    Upload new image
                  </Button>
                  <p className="text-gray-500 text-xs mt-2">
                    Recommended: 800x800 px. Formats: JPG, PNG, GIF.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <Input
                leftIcon={<User />}
                label="First Name"
                placeholder="Enter your first name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-white"
              />

            </div>

            <div className="mb-3">
              <Input
                leftIcon={<User />}
                label="Last Name"
                placeholder="Enter your last name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-white"
              />
            </div>

            <div className="mb-3">
              <Input
                leftIcon={<User />}
                label="Username"
                placeholder="Enter your username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white"
              />

            </div>


            {/* Bio Field */}
            <div className="mb-3">
              <TextareaInput
                label="Bio (Optional)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Short bio"
                className="w-full resize-none bg-white"
              />

            </div>

            {/* Submit and Skip Buttons */}
            <div className="flex flex-col items-center mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                <ButtonLoader
                  isLoading={loading}
                  caption="Save and Continue"
                />
              </Button>
              <Button type="button" variant={"outline"} className="w-full mt-3 border border-primary-100" onClick={() => router.push(ROUTES.SELECT_INTERESTS)}>
                Skip to do these later
              </Button>{" "}
            </div>
          </form>

          {/* Skip Info */}
          <p className="w-full text-gray-500 text-xs mt-2 text-center mb-6">
            You can skip this process now and complete your profile setup
            later in the profile settings.
          </p>
        </div>
      </div>
    </>
  );
};

export default ProfileSetup;
