import { CreateSpaceForm } from "@/types";
import { useState } from "react";
import { z } from "zod";

type HookProps = {
  store: CreateSpaceForm;
};

const useCreateSpaceValidator = ({ store }: HookProps) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateSpaceForm, string>>
  >({});

  const CreateSpaceSchema = z.object({
    name: z.string().min(1, { message: "Space name is required" }),
    description: z
      .string()
      .min(1, { message: "Space Description is required" }),
  });

  const validate = async (_callback?: () => void) => {
    const result = CreateSpaceSchema.safeParse(store);

    if (!result.success) {
      const tempErrors: Partial<Record<keyof CreateSpaceForm, string>> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          tempErrors[error.path[0] as keyof CreateSpaceForm] = error.message;
        }
      });
      setErrors(tempErrors);
    } else {
      setErrors({});
      _callback?.();
    }
  };

  const validateField = (field: keyof CreateSpaceForm, value: string) => {
    const fieldSchema = z.object({
      [field]: (CreateSpaceSchema.shape as Record<keyof CreateSpaceForm, any>)[
        field
      ],
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

export { useCreateSpaceValidator };
