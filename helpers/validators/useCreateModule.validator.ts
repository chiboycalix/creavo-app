import { CreateModuleForm } from "@/types";
import { useState } from "react";
import { z } from "zod";

const CreateModuleShema = z.object({
  moduleTitle: z.string().min(1, { message: "Module name is required" }),
});

type HookProps = {
  store: CreateModuleForm;
};

const useCreateModuleFormValidator = ({ store }: HookProps) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateModuleForm, string>>
  >({});

  const validate = async (_callback?: () => void) => {
    const result = CreateModuleShema.safeParse(store);

    if (!result.success) {
      const tempErrors: Partial<Record<keyof CreateModuleForm, string>> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          tempErrors[error.path[0] as keyof CreateModuleForm] = error.message;
        }
      });
      setErrors(tempErrors);
    } else {
      setErrors({});
      _callback?.();
    }
  };

  const validateField = (field: keyof CreateModuleForm, value: string) => {
    const fieldSchema = z.object({ [field]: CreateModuleShema.shape[field] });
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

export { useCreateModuleFormValidator };
