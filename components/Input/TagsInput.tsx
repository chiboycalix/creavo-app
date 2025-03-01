"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode, useState, useRef } from "react";

export type TagsInputProps = {
  label?: ReactNode;
  errorMessage?: string | false;
  className?: string;
  placeholder?: string;
  value?: string[]; // Array of tags
  onChange?: (tags: string[]) => void; // Callback for tag changes
} & React.ComponentProps<"input">;

export const TagsInput = ({
  label,
  errorMessage,
  className,
  placeholder = "Add tags (e.g., #fun #tiktok)",
  value = [],
  onChange,
  ...rest
}: TagsInputProps) => {
  const [tags, setTags] = useState<string[]>(value);
  const [inputValue, setInputValue] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Sync external value changes
  // React.useEffect(() => {
  //   setTags(value);
  // }, [value]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const trimmedValue = inputValue.trim();

    if ((key === "Enter" || key === " ") && trimmedValue) {
      e.preventDefault();
      // Ensure uniqueness and add hashtag prefix if missing
      const newTag = trimmedValue.startsWith("#") ? trimmedValue : `#${trimmedValue}`;
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        onChange?.(updatedTags);
      }
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    onChange?.(updatedTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="leading-3 w-full">
      {label && (
        <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 p-2 border-primary-100 border-2 rounded bg-primary-50/25",
          errorMessage && "bg-red-100",
          className
        )}
        onClick={() => tagInputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-primary-200 text-primary-800 text-sm px-2 py-1 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="text-primary-600 hover:text-primary-800 focus:outline-none"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={tagInputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleAddTag}
          placeholder={tags.length === 0 ? placeholder : ""}
          className={cn(
            "flex-1 outline-none bg-transparent text-gray-800 text-sm placeholder:text-gray-400",
            "disabled:cursor-not-allowed"
          )}
          {...rest}
        />
      </div>
      {errorMessage && <small className="text-red-600 text-sm mt-1">{errorMessage}</small>}
    </div>
  );
};