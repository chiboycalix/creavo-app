import { useAppSelector } from "@/hooks/useStore.hook";
import { CreateCourseForm } from "@/services/course.service";
import { useState } from "react";
import { z } from "zod";

type HookProps = {
  store: CreateCourseForm;
};

const useCreateCourseFormValidator = ({ store }: HookProps) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateCourseForm, string>>
  >({});
  const { createCourseForm: createCourseStateValues } = useAppSelector(
    (store) => store.courseStore
  );

  const CreateCourseShema = z.object({
    title: z.string().min(1, { message: "Course title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    difficultyLevel: z
      .string()
      .min(1, { message: "Difficulty Level is required" }),
    isPaid: z.boolean(),
    tags: z
      .array(z.string().min(1, { message: "Please add at least one tag" }))
      .min(1, { message: "Please add at least one tag" }),
    amount: createCourseStateValues?.isPaid
      ? z.string().trim().min(1, { message: "Amount is required" })
      : z.string().optional(),
    currency: createCourseStateValues?.isPaid
      ? z.string().min(1, { message: "Currency is required" })
      : z.string().optional(),
    promotionalUrl: z.string().optional(),
  });

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
