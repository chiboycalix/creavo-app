"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MdOutlineCloudUpload } from "react-icons/md";
import { XIcon } from "lucide-react";
import { formatFileSize } from "@/utils";


interface UploadProductProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (files: File[]) => void;
}

const UploadProduct: React.FC<UploadProductProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [alert, setAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFiles([...files]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      handleFiles([...event.dataTransfer.files]);
    }
  };

  const handleFiles = (files: File[]) => {
    if (files.some((file) => file.size > 20 * 1024 * 1024)) {
      setAlert("Max 20 MB files are allowed");
      return;
    }
    setMediaFiles(files);
    setAlert(null);
  };

  const handleDelete = (indexToRemove: number) => {
    setMediaFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

//   const handleSubmit = () => {
//     setLoading(true);
//     onSubmit(mediaFiles);
//     setLoading(false);
//     setMediaFiles([]);
//     setStep
//     onClose();

//   };

  if (!isOpen) return null;

  const renderThumbnails = () => {
    return mediaFiles.map((file, index) => (
      <div
        key={index}
        className="flex border rounded-xl p-2.5 gap-2.5 items-center relative"
      >
        {file.type.startsWith("image") ? (
          <div className="w-10 h-10 aspect-square">
            <img
              src={URL.createObjectURL(file)}
              className="bg-cover w-full h-full object-cover rounded-md"
              alt="Preview"
            />
          </div>
        ) : (
          <video className="w-10 h-10 aspect-square" width="100" muted>
            <source src={URL.createObjectURL(file)} type="video/mp4" />
          </video>
        )}
        <div>
          <p className="text-xs font-medium line-clamp-1">{file.name}</p>
          <p className="text-[10px]">{formatFileSize(file.size)}</p>
        </div>
        <XIcon
          className="h-4 w-4 p-px rounded-full bg-white border absolute -top-2 -right-2 cursor-pointer"
          onClick={() => handleDelete(index)}
        />
      </div>
    ));
  };

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
        <div>
          <h3 className="text-base font-medium text-gray-900">Upload File</h3>
          <p className="text-xs">Add your product image here</p>
        </div>

        {/* Title Input */}
        <div className="mt-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter Title"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>

        {/* Drag & Drop Area */}
        <div
          className="drag-drop-area mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
          onClick={handleFileClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*, video/*"
            onChange={handleFileUpload}
            className="hidden"
            ref={fileInputRef}
            multiple
          />
          <div className="flex flex-col items-center">
            <MdOutlineCloudUpload className="h-12 w-12 mb-2 text-primary" />
            <p className="text-sm text-gray-500">
              Drag & Drop file or <span className="text-primary">browse</span>
            </p>
            <p className="text-xs text-gray-400">Max 20 MB files are allowed</p>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}

        {mediaFiles.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">{renderThumbnails()}</div>
        )}

        {/* Alert Message */}
        {alert && <p className="text-red-500 text-sm mt-2">{alert}</p>}

        {/* Submit Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onSubmit(mediaFiles)}
            disabled={mediaFiles.length === 0}
            className="bg-primary text-sm text-white px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadProduct;
