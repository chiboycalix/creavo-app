"use client"
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { TextInput, TextInputProps } from "./TextInput";

export const PasswordInput = (props: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      type={showPassword ? "text" : "password"}
      rightIcon={showPassword ? <EyeOff /> : <Eye />}
      onRightIconClick={() => setShowPassword(!showPassword)}
      {...props}
    />
  );
};