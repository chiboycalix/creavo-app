import { CreateCourseForm } from "@/services/course.service";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type CourseData = {
  courseId: string;
  isPaid: boolean;
  description: string;
  difficultyLevel: string;
  tags: string[];
  title: string;
};

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
  courseData: {
    courseId: "",
    title: "",
    isPaid: false,
    description: "",
    difficultyLevel: "",
    tags: [],
  } as CourseData,
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

    updateCourseData: (state, action: PayloadAction<Partial<CourseData>>) => {
      state.courseData = {
        ...state.courseData,
        ...action.payload,
      };
    },

    resetUpdateCourseData: (state) => {
      state.courseData = initialState.courseData;
    },
  },
});

export const {
  updatCreateCourseForm,
  resetCreateCourseForm,
  updateCourseData,
  resetUpdateCourseData,
} = courseStore.actions;
export default courseStore.reducer;
