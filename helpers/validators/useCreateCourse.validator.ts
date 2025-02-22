import { CreateCourseForm } from "@/services/course.service";
import { useState } from "react";
import { z } from "zod";

const CreateCourseShema = z.object({
  title: z.string().min(1, { message: "Course title is required" }),
  categoryId: z.number().min(1, { message: "Category is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  level: z.string().min(1, { message: "Level is required" }),
  price: z.number().min(0, { message: "Price is required" }),
  thumbnailUrl: z.string().min(1, { message: "Thumbnail is required" }),
  language: z.string().min(1, { message: "Language is required" }),
  isPaid: z.boolean(),
  tags: z.array(z.string()),
});

type HookProps = {
  store: CreateCourseForm;
};

const useCreateCourseFormValidator = ({ store }: HookProps) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateCourseForm, string>>
  >({});

  const validate = async (_callback?: () => void) => {
    const result = CreateCourseShema.safeParse(store);

    if (!result.success) {
      const tempErrors: Partial<Record<keyof CreateCourseForm, string>> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          tempErrors[error.path[0] as keyof CreateCourseForm] = error.message;
        }
      });
      setErrors(tempErrors);
    } else {
      setErrors({});
      _callback?.();
    }
  };

  const validateField = (field: keyof CreateCourseForm, value: string) => {
    const fieldSchema = z.object({ [field]: CreateCourseShema.shape[field] });
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

export { useCreateCourseFormValidator };
