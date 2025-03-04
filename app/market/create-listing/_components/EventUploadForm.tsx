import React, { useRef } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


interface EventUploadFormProps {
  handleFileClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventUploadForm: React.FC<EventUploadFormProps> = ({
  handleFileClick,
  handleDragOver,
  handleDrop,
  handleFileUpload,
}) => {
  const fileInputRef = useRef(null);

  return (
    <div className="overflow-y-auto max-h-[600px] px-4 custom-scrollbar mt-4 p-4">
  

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

      <div className="flex items-center gap-3 mt-4">
        <div className="flex flex-col">
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700"
          >
            Currency
          </label>
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
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            type="text"
            id="amount"
            placeholder="Amount"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>
      <p className="text-xs mt-1">
        By default, we automatically convert the amount to other currencies of
        the buyer
      </p>

      <div className="mt-4">
        <label
          htmlFor="desc"
          className="block text-sm font-medium text-gray-700"
        >
          Event Information
        </label>
        <textarea
          rows={4}
          id="desc"
          placeholder="Enter Description"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="category" className="text-sm font-medium text-gray-700">
          Cover Image
        </label>

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
      </div>

      <div className="mt-4 flex flex-col">
        <label htmlFor="category" className="text-sm font-medium text-gray-700">
          Category
        </label>
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

      <div className="mt-4 flex flex-col">
        <label
          htmlFor="event-type"
          className="text-sm font-medium text-gray-700"
        >
          Event Type
        </label>
        <select
          id="event-type"
          className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option value="tech">Online</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Start Time:
          </label>
          <input
            type="time"
            name="startTime"
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">End Time:</label>
          <input
            type="time"
            name="endTime"
            className="border rounded p-2 w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Start Date:
          </label>
          <DatePicker
            // selected={selectedDate}
            // onChange={handleDateChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">End Date:</label>
          <DatePicker
            // selected={selectedDate}
            // onChange={handleDateChange}
            className="border rounded p-2 w-full"
          />
        </div>
      </div>
      <div className="mt-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Meeting Link
        </label>
        <input
          type="text"
          id="title"
          placeholder="Enter meeting link here ..."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
    </div>
  );
};

export default EventUploadForm;
