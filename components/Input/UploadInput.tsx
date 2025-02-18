// import { cn } from "@/lib/utils";
// import { ReactNode, useState, useRef } from "react";
// import { MdOutlineCloudUpload } from "react-icons/md";

// type UploadInputProps = {
//   label?: ReactNode;
//   errorMessage?: string | false;
//   className?: string;
//   accept?: string; // File types to accept (e.g., "video/*")
//   maxFiles?: number; // Maximum number of files allowed
//   onFilesChange?: (files: File[]) => void; // Callback when files change
// } & React.ComponentProps<'div'>;

// export const UploadInput = ({
//   label,
//   errorMessage,
//   className,
//   accept = "video/*",
//   maxFiles = 5,
//   onFilesChange,
//   ...rest
// }: UploadInputProps) => {
//   const [files, setFiles] = useState<File[]>([]);
//   const [isDragging, setIsDragging] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Handle file selection via browsing
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
//     if (files.length + selectedFiles.length > maxFiles) {
//       alert(`You can only upload up to ${maxFiles} files.`);
//       return;
//     }
//     setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
//     onFilesChange?.([...files, ...selectedFiles]);
//   };

//   // Handle drag-and-drop
//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const droppedFiles = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
//     if (files.length + droppedFiles.length > maxFiles) {
//       alert(`You can only upload up to ${maxFiles} files.`);
//       return;
//     }
//     setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
//     onFilesChange?.([...files, ...droppedFiles]);
//   };

//   // Handle file removal
//   const handleRemoveFile = (index: number) => {
//     const updatedFiles = files.filter((_, i) => i !== index);
//     setFiles(updatedFiles);
//     onFilesChange?.(updatedFiles);
//   };

//   // Handle click on the upload area
//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div className="leading-3">
//       {label && (
//         <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
//           {label}
//         </label>
//       )}
//       <div
//         className={cn(
//           "relative border-2 border-dashed bg-primary-50 border-primary-100 rounded-lg p-4 py-32 cursor-pointer",

//           isDragging && "border-primary-500 bg-primary-100",
//           errorMessage && "border-red-500",
//           className
//         )}
//         onClick={handleUploadClick}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         {...rest}
//       >
//         <input
//           type="file"
//           accept={accept}
//           onChange={handleFileChange}
//           className="hidden"
//           ref={fileInputRef}
//           multiple
//         />
//         <div className="flex flex-col items-center">
//           <MdOutlineCloudUpload className="h-12 w-12 mb-2 text-primary" />
//           <p className="text-gray-500">
//             Drag & Drop file or{" "}
//             <span className="text-primary">browse</span>
//           </p>
//           <p className="text-gray-400 mt-5">
//             Max {10} MB files are allowed
//           </p>
//         </div>
//       </div>

//       {files.length > 0 && (
//         <div className="mt-4 flex flex-col gap-2">
//           {files.map((file, index) => (
//             <div key={file.name} className="flex items-center justify-between p-2 border border-primary-100 rounded-lg">
//               <span className="text-sm text-gray-700">{file.name}</span>
//               <button
//                 onClick={() => handleRemoveFile(index)}
//                 className="text-red-500 hover:text-red-700"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
//     </div>
//   );
// };

import { cn } from "@/lib/utils";
import { ReactNode, useState, useRef } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";

type UploadInputProps = {
  label?: ReactNode;
  errorMessage?: string | false;
  className?: string;
  accept?: string; // File types to accept (e.g., "video/*,image/*")
  maxFiles?: number; // Maximum number of files allowed
  onFilesChange?: (files: File[]) => void; // Callback when files change
} & React.ComponentProps<'div'>;

export const UploadInput = ({
  label,
  errorMessage,
  className,
  accept = "video/*,image/*", // Accept both video and image files
  maxFiles = 5,
  onFilesChange,
  ...rest
}: UploadInputProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection via browsing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    onFilesChange?.([...files, ...selectedFiles]);
  };

  // Handle drag-and-drop
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
    if (files.length + droppedFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    onFilesChange?.([...files, ...droppedFiles]);
  };

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  // Handle click on the upload area
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="leading-3">
      {label && (
        <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative border-2 border-dashed bg-white border-primary-100 rounded-lg p-4 py-28 cursor-pointer",
          isDragging && isDragging && "border-primary-500 bg-primary-100",
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
          <p className=" text-gray-500 mb-4">
            Drag & Drop file or{" "}
            <span className="text-primary">browse</span>
          </p>
          <p className=" text-gray-400">
            Max {maxFiles} files allowed
          </p>
        </div>
      </div>
      <p className='mt-4 text-sm'>Only support MP4, MOV and FLV videos</p>
      {files.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {files.map((file, index) => (
            <div key={file.name} className="flex items-center justify-between p-2 border border-primary-100 rounded-lg">
              <span className="text-sm text-gray-700">{file.name}</span>
              <button
                onClick={() => handleRemoveFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
    </div>
  );
};