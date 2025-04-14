"use client";
import React, { FormEvent, useRef, useState } from "react";
import ButtonLoader from "@/components/ButtonLoader";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Input } from "@/components/Input";
import { TextareaInput } from "@/components/Input/TextareaInput";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditSpacePayload, editSpaceService } from "@/services/community.service";
import { uploadImageToCloudinary } from "@/utils";

type EditSpaceProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
  currentSpace?: any;
};

const EditSpace = ({
  isOpen,
  onClose,
  anchorRect,
  currentSpace,
}: EditSpaceProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [spaceName, setSpaceName] = useState<string>("");
  const [spaceDescription, setSpaceDescription] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const menuPosition = {
    top: 2,
    right: 0,
  };

  const defaultAvatar = "https://i.postimg.cc/Bv2nscWb/icon-default-avatar.png";

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

  const { mutate: handleEditSpace, isPending: isEditingSpace } = useMutation({
    mutationFn: (payload: EditSpacePayload) => editSpaceService(payload),
    onSuccess: async (data) => {
      toast.success("Space updated successfully");
      queryClient.invalidateQueries({ queryKey: ["useListSpaces"] })
      onClose();
    },
    onError: (error: any) => {
      console.log({ error })
      toast.error(`Something went wrong`);
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    let imageUrl = currentSpace?.logo;
    if (selectedImage) {
      imageUrl = await uploadImageToCloudinary(selectedImage);
    }

    await handleEditSpace({
      spaceId: currentSpace?.id,
      name: spaceName || currentSpace?.displayName,
      description: spaceDescription || currentSpace?.description,
      logo: imageUrl,
      communityId: currentSpace?.communityId,
    });
  }

  if (!anchorRect) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "fixed",
              top: menuPosition.top,
              right: menuPosition.right,
              transformOrigin: "bottom right",
            }}
            className="z-50 w-96 bg-white border rounded-lg shadow-lg h-[99.5vh] p-3"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold">Edit Space</p>
              <X size={18} onClick={onClose} className="cursor-pointer" />
            </div>
            <form onSubmit={handleSubmit}>

              <div className="flex justify-between items-center gap-3 mt-2 bg-white border rounded-md p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      imagePreview ||
                      currentSpace?.logo ||
                      defaultAvatar
                    }
                    alt="Profile Preview"
                    className="rounded-full object-cover w-12 h-12"
                  />
                </div>

                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden "
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    onClick={handleImageClick}
                    className="px-6 py-0 border rounded-md text-xs"
                    variant={"outline"}
                  >
                    Change Image
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <Input
                  label="Name"
                  placeholder=""
                  maxLength={54}
                  value={spaceName || currentSpace?.displayName}
                  onChange={(e) => setSpaceName(e.target.value)}
                  className="w-full bg-white"
                />
              </div>
              <div className="mt-6">
                <TextareaInput
                  maxLength={365}
                  label="Description"
                  value={spaceDescription || currentSpace?.description}
                  onChange={(e) => setSpaceDescription(e.target.value)}
                  className="w-full bg-white"
                />
              </div>

              <div className="flex items-center justify-between mt-8 w-full">
                <Button
                  disabled={isEditingSpace}
                  className="w-full"
                >
                  <ButtonLoader
                    isLoading={isEditingSpace}
                    caption="Save Changes"
                  />
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditSpace;
