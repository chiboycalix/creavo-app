import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CustomImageIconProps extends HTMLAttributes<HTMLImageElement> {
  imageUrl: string;
  alt: string;
}

const CustomImageIcon = ({ imageUrl, className, alt }: CustomImageIconProps) => {
  return (
    <img
      src={imageUrl}
      alt="Custom Icon"
      className={cn("w-6 h-6 rounded-full")}
      loading="lazy"
    />
  );
};

export default CustomImageIcon;