"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MdOutlineCloudUpload } from "react-icons/md";
import { XIcon } from "lucide-react";
import { formatFileSize } from "@/utils";
import { useRouter } from "next/navigation";

interface UploadSuccessProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadSuccess: React.FC<UploadSuccessProps> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [alert, setAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleViewListing = () => {
    onClose();
    router.push("/market");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XIcon className="h-6 w-6" />
        </button>

        {/* Modal Content */}
        <div className="drag-drop-area mt-4 p-4 rounded-lg cursor-pointer">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24">
              <img src={"/assets/Congrats.png"} alt="congrats" />
            </div>
            <h2 className="text-sm text-gray-500">
              Product listed successfully
            </h2>
            <p className="text-xs text-gray-400">
              Successful! Your have listed your product to the market place
            </p>
          </div>
        </div>
        {/* Submit Button */}
        <div className="mt-4 flex items-center">
          <button
            onClick={handleViewListing}
            className="bg-primary text-sm text-white px-4 py-2 rounded-lg w-full"
          >
            View Listing
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadSuccess;
