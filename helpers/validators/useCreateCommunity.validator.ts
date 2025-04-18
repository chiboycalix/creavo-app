import { CreateCommunityForm } from "@/types";
import { useState } from "react";
import { z } from "zod";

type HookProps = {
  store: CreateCommunityForm;
};

const useCreateCommunityValidator = ({ store }: HookProps) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateCommunityForm, string>>
  >({});

  const CreateCommunitySchema = z.object({
    name: z.string().min(1, { message: "Community name is required" }),
    description: z
      .string()
      .min(1, { message: "Community Description is required" }),
  });

  const validate = async (_callback?: () => void) => {
    const result = CreateCommunitySchema.safeParse(store);

    if (!result.success) {
      const tempErrors: Partial<Record<keyof CreateCommunityForm, string>> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          tempErrors[error.path[0] as keyof CreateCommunityForm] =
            error.message;
        }
      });
      setErrors(tempErrors);
    } else {
      setErrors({});
      _callback?.();
    }
  };

  const validateField = (field: keyof CreateCommunityForm, value: string) => {
    const fieldSchema = z.object({
      [field]: (
        CreateCommunitySchema.shape as Record<keyof CreateCommunityForm, any>
      )[field],
    });
    const result = fieldSchema.safeParse({ [field]: value });

    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: result.error.errors[0].message,
      }));
    } else {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[field];
        return updatedErrors;
      });
    }
  };

  return { validate, errors, validateField };
};

export { useCreateCommunityValidator };
