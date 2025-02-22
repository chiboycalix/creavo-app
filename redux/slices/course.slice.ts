import { CreateCourseForm } from "@/services/course.service";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  createCourseForm: {
    title: "",
    categoryId: 0,
    description: "",
    level: "",
    price: 0,
    thumbnailUrl: "",
    tags: [],
    isPaid: false,
    language: "",
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
