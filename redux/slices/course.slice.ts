import { CreateCourseForm } from "@/services/course.service";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  createCourseForm: {
    title: "",
    description: "",
    difficultyLevel: "",
    thumbnailUrl: "",
    tags: [],
    isPaid: false,
    currency: "",
    amount: "",
  } as CreateCourseForm,
};

const courseStore = createSlice({
  name: "courseStore",
  initialState,
  reducers: {
    updatCreateCourseForm: (
      state,
      action: PayloadAction<Partial<CreateCourseForm>>
    ) => {
      state.createCourseForm = {
        ...state.createCourseForm,
        ...action.payload,
      };
    },
    resetCreateCourseForm: (state) => {
      state.createCourseForm = initialState.createCourseForm;
    },
  },
});

export const { updatCreateCourseForm, resetCreateCourseForm } =
  courseStore.actions;
export default courseStore.reducer;
