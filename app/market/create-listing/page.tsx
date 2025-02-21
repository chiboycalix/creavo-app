"use client";

import React, { useCallback, useRef, useState } from "react";
import { BookOpenIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "@/components/Spinner";
import { MdOutlineCloudUpload } from "react-icons/md";
import { formatFileSize } from "@/utils";
import UploadProduct from "./_components/UploadProduct";
import UploadSuccess from "./_components/UploadSuccess";

type PostUploadModalProps = {
  handleClose: () => void;
  handleSubmit: (files: File[]) => void;
  isOpen: boolean;
};

type Location = {
  latitude: number;
  longitude: number;
};

const CreateListing = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(""); // Stores the selected route
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<"image" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const pagedata = [
    {
      icon: BookOpenIcon,
      title: "Digital Product",
      description: "Choose the type of product you want to sell",
      link: "digital-product",
      color: "blue",
    },
    {
      icon: BookOpenIcon,
      title: "Courses",
      description: "Choose the type of product you want to sell",
      link: "courses",
      color: "green",
    },
    {
      icon: BookOpenIcon,
      title: "Ebooks",
      description: "Choose the type of product you want to sell",
      link: "ebooks",
      color: "purple",
    },
    {
      icon: BookOpenIcon,
      title: "Events",
      description: "Choose the type of product you want to sell",
      link: "events",
      color: "red",
    },
    {
      icon: BookOpenIcon,
      title: "Services",
      description: "Choose the type of product you want to sell",
      link: "services",
      color: "yellow",
    },
    {
      icon: BookOpenIcon,
      title: "Other",
      description: "Choose the type of product you want to sell",
      link: "other",
      color: "gray",
    },
  ];

  // Function to open modal and set selected link
  const handleOpenModal = () => {
    // setSelectedLink(link);
    console.log("I am open");
    setIsModalOpen(true);
    setStep(2);
  };

  const handleClose = () => {
    console.log("closed");
    setIsModalOpen(false);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);

    const files = Array.from(e.target.files || []);
    const videoFiles = files.filter((file) => file.type.startsWith("video/"));
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    // Check file size
    if (files.some((file) => file.size > 20000000)) {
      setAlert("File size should be less than 20MB");
      setLoading(false);
      setAlert("");
      return;
    }

    // Validation for number of files
    if (imageFiles.length > 1) {
      setAlert("You can upload only 1 image at a time");
      setLoading(false);
      return;
    }

    setMediaFiles((prevFiles) => [...prevFiles, ...files]);
    setFileType(files[0].type.startsWith("image") ? "image" : null);
    setLoading(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setMediaFiles((prevFiles) => [...prevFiles, ...files]);
    setFileType(files[0].type.startsWith("image") ? "image" : null);
  };

  const handleGetLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }, []);

  const success = (position: GeolocationPosition) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation({ latitude, longitude });
  };

  const error = () => {
    console.log("Unable to retrieve your location");
  };

  const handleGetDeviceId = async () => {
    try {
      const res = await fetch("https://api.ipify.org/?format=json");
      const data = await res.json();
      if (res.ok) {
        setDeviceId(data.ip);
      }
    } catch (error) {
      console.log("Error fetching device ID:", error);
    }
  };

  const handleDelete = (indexToRemove: number) => {
    setMediaFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  function handleSubmit(): void {
    setStep(3);
    // throw new Error("Function not implemented.");
  }

  const handleViewListing = () => {
    setLoading(false);
    handleClose();
  };

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
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Create Listing</h1>
        <p className="text-gray-600 mt-1">
          Choose the type of product you want to sell
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {pagedata.map((item, index) => (
          <button
            key={index}
            onClick={handleOpenModal}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <div className={`mb-3 text-${item.color}-500`}>
              <item.icon size={40} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {item.title}
            </h2>
            <p className="text-gray-600 mt-1">{item.description}</p>
          </button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Transition show={isModalOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
              {/* Overlay */}
              <TransitionChild
                as={motion.div}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="fixed inset-0 bg-black bg-opacity-50"
              />

              {/* Modal Content */}
              {step === 2 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <UploadProduct
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <UploadSuccess
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                  />
                </div>
              )}
            </Dialog>
          </Transition>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateListing;
