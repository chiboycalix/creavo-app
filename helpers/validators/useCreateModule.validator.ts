import { ModuleForm } from "@/types";
import { useState } from "react";
import { z } from "zod";

const CreateModuleShema = z.object({
  title: z.string().min(1, { message: "Module name is required" }),
  difficultyLevel: z
    .string()
    .min(1, { message: "Difficulty level is required" }),
  description: z.string().min(1, { message: "Module description is required" }),
  media: z.array(z.object({})).optional(),
});

type HookProps = {
  store: ModuleForm;
};

const useCreateModuleFormValidator = ({ store }: HookProps) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof ModuleForm, string>>
  >({});

  const validate = async (_callback?: () => void) => {
    const result = CreateModuleShema.safeParse(store);

    if (!result.success) {
      const tempErrors: Partial<Record<keyof ModuleForm, string>> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          tempErrors[error.path[0] as keyof ModuleForm] = error.message;
        }
      });
      setErrors(tempErrors);
    } else {
      setErrors({});
      _callback?.();
    }
  };

  const validateField = (field: keyof ModuleForm, value: string) => {
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
