"use client";

import axios from "axios";
import { cn } from "@/lib/utils";
import { ReactNode, useState, useRef, useEffect } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useToast } from "@/context/ToastContext";
import { RouterSpinner } from "../Loaders/RouterSpinner";

type UploadInputProps = {
  label?: ReactNode;
  errorMessage?: string | false;
  className?: string;
  accept?: string;
  maxFiles?: number;
  nextPath?: string;
  placeholder?: string;
  footerText?: string;
  onChange?: (urls: string[]) => void;
} & React.ComponentProps<"div">;

type UploadProgress = {
  file: File;
  progress: number;
  url?: string;
  previewUrl?: string;
  uploading: boolean;
  type: "image" | "video";
};

export const UploadInput = ({
  label,
  errorMessage,
  className,
  accept = "video/*,image/*",
  maxFiles = 5,
  nextPath,
  placeholder = `Max ${maxFiles} pictures files per upload`,
  footerText = "Supports MP4, MOV, FLV videos and common image formats",
  onChange, // Destructured new prop
  ...rest
}: UploadInputProps) => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

  useEffect(() => {
    return () => {
      uploads.forEach((upload) => {
        if (upload.previewUrl) URL.revokeObjectURL(upload.previewUrl);
      });
    };
  }, [uploads]);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET!);

    try {
      const response = await axios.post(CLOUDINARY_API_URL, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploads((prev) =>
            prev.map((upload) =>
              upload.file === file
                ? { ...upload, progress, uploading: true }
                : upload
            )
          );
        },
      });
      const url = response.data.secure_url;
      setUploads((prev) =>
        prev.map((upload) =>
          upload.file === file ? { ...upload, url, uploading: false } : upload
        )
      );
      return url;
    } catch (error) {
      console.error("Upload failed:", error);
      setUploads((prev) =>
        prev.map((upload) =>
          upload.file === file ? { ...upload, uploading: false } : upload
        )
      );
      showToast('error', 'Upload failed', 'An error occurred while uploading the file.');
      return null;
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    if (uploads.length + newFiles.length > maxFiles) {
      showToast(
        'error',
        'Failed to upload file',
        errorMessage || `You can only upload up to ${maxFiles} files per post.`
      );
      return;
    }

    const newUploads: UploadProgress[] = newFiles.map((file) => ({
      file,
      progress: 0,
      uploading: true,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
    }));
    setUploads((prev) => [...prev, ...newUploads]);

    const urls = await Promise.all(newFiles.map((file) => uploadToCloudinary(file)));
    const validUrls = urls.filter((url) => url !== null) as string[];

    // Call onChange with the valid URLs once uploads are complete
    if (validUrls.length > 0 && onChange) {
      onChange(validUrls);
    }

    return validUrls;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(selectedFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    handleFiles(droppedFiles);
  };

  const handleRemoveFile = (index: number) => {
    const uploadToRemove = uploads[index];
    if (uploadToRemove.previewUrl) URL.revokeObjectURL(uploadToRemove.previewUrl);
    setUploads((prev) => {
      const newUploads = prev.filter((_, i) => i !== index);
      // Update onChange with remaining URLs after removal
      if (onChange) {
        const remainingUrls = newUploads
          .map((upload) => upload.url)
          .filter(Boolean) as string[];
        onChange(remainingUrls);
      }
      return newUploads;
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleNext = async () => {
    if (!nextPath) return;

    setIsLoading(true);
    const urls = uploads.map((upload) => upload.url).filter(Boolean) as string[];
    if (urls.length > 0) {
      const encodedUrls = btoa(JSON.stringify(urls));
      router.push(`${nextPath}?urls=${encodedUrls}`);
    } else {
      showToast('error', 'No files uploaded', 'Please upload files before proceeding.');
    }
    setIsLoading(false);
  };

  const allUploaded = uploads.length > 0 && uploads.every((upload) => !upload.uploading);

  return (
    <div className="leading-3">
      {isLoading && <RouterSpinner />}
      {label && (
        <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative border-2 border-dashed bg-white border-primary-100 rounded-lg p-4 py-28 cursor-pointer",
          isDragging && "border-primary-500 bg-primary-100",
          errorMessage && "border-red-500",
          className
        )}
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        {...rest}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
          multiple
        />
        <div className="flex flex-col items-center">
          <MdOutlineCloudUpload className="h-12 w-12 mb-2 text-primary" />
          <p className="text-gray-500 mb-4">
            Drag & Drop files or <span className="text-primary">browse</span>
          </p>
          <p className="text-gray-400 text-sm">{placeholder}</p>
        </div>
      </div>
      <p className="mt-4 text-sm">{footerText}</p>
      {uploads.length > 0 && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Uploading Files</h3>
            <div className="flex flex-wrap gap-4">
              {uploads.map((upload, index) => (
                <div key={upload.file.name} className="relative w-52 h-40 flex flex-col">
                  <div className="w-52 h-32 flex-shrink-0">
                    {upload.type === "image" ? (
                      <img
                        src={upload.url || upload.previewUrl}
                        alt={upload.file.name}
                        className="w-full h-full object-contain rounded"
                      />
                    ) : (
                      <video
                        src={upload.url || upload.previewUrl}
                        controls
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div
                      className={cn(
                        "h-3 rounded-full transition-all duration-200",
                        upload.uploading ? "bg-blue-600" : "bg-green-600"
                      )}
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                  {!upload.uploading && (
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      disabled={upload.uploading}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {allUploaded && nextPath && (
            <Button
              onClick={handleNext}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary-600 transition-colors duration-200"
              disabled={isLoading}
            >
              Next
            </Button>
          )}
        </div>
      )}
      {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
    </div>
  );
};