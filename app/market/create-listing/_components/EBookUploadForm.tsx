import React, { useRef } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import { CloudUploadIcon } from "lucide-react";

interface EbookUploadFormProps {
  handleFileClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EbookUploadForm: React.FC<EbookUploadFormProps> = ({ handleFileClick, handleDragOver, handleDrop, handleFileUpload }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="overflow-y-auto max-h-[600px] px-4 custom-scrollbar mt-4 p-4">
      <div>
        <h3 className="text-base font-medium text-gray-900">Add a new Ebook</h3>
        <p className="text-xs">To start selling, add a price, cover image and description</p>
      </div>

      <div className="flex flex-col gap-1 mt-4">
        <h3 className="text-base font-medium text-gray-900">File(s)</h3>
        <p className="text-xs">Upload your product files</p>
        <button className="flex items-center gap-2 p-1 w-1/3 bg-[#FEF2F2] rounded-md">
          <CloudUploadIcon className="h-5 w-5" />
          <span className="text-sm">Upload product file</span>
        </button>
      </div>

      <div className="mt-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Enter Title"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      <div className="flex items-center gap-3 mt-4">
        <div className="flex flex-col">
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
          <select
            id="currency"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="text"
            id="amount"
            placeholder="Amount"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>
      <p className="text-xs mt-1">By default, we automatically convert the amount to other currencies of the buyer</p>

      <div className="mt-4">
        <label htmlFor="desc" className="block text-sm font-medium text-gray-700">Product Description</label>
        <textarea
          rows={4}
          id="desc"
          placeholder="Enter Description"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      <div className="mt-4 flex flex-col">
        <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option value="tech">Tech</option>
          <option value="politics">Politics</option>
          <option value="culture">Culture</option>
          <option value="other">Other</option>
        </select>
      </div>

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
          <p className="text-sm text-gray-500">Drag & Drop file or <span className="text-primary">browse</span></p>
          <p className="text-xs text-gray-400">Max 20 MB files are allowed</p>
        </div>
      </div>
    </div>
  );
};

export default EbookUploadForm;
