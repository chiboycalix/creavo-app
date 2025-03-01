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
  createLongCourseForm: {
    title: "",
    description: "",
    difficultyLevel: "",
    promotionalUrl: "",
    tags: [],
    isPaid: false,
    currency: "",
    amount: "",
  } as CreateCourseForm,

  longCourseData: {
    courseId: "",
    title: "",
    isPaid: false,
    description: "",
    difficultyLevel: "",
    tags: [],
  } as CourseData,

  createShortCourseForm: {
    title: "",
    description: "",
    difficultyLevel: "",
    promotionalUrl: "",
    tags: [],
    isPaid: false,
    currency: "",
    amount: "",
  } as CreateCourseForm,

  shortCourseData: {
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
    updatCreateLongCourseForm: (
      state,
      action: PayloadAction<Partial<CreateCourseForm>>
    ) => {
      state.createLongCourseForm = {
        ...state.createLongCourseForm,
        ...action.payload,
      };
    },
    resetCreateLongCourseForm: (state) => {
      state.createLongCourseForm = initialState.createLongCourseForm;
    },

    updateLongCourseData: (
      state,
      action: PayloadAction<Partial<CourseData>>
    ) => {
      state.longCourseData = {
        ...state.longCourseData,
        ...action.payload,
      };
    },
    resetLongCourseData: (state) => {
      state.longCourseData = initialState.longCourseData;
    },

    updatCreateShortCourseForm: (
      state,
      action: PayloadAction<Partial<CreateCourseForm>>
    ) => {
      state.createShortCourseForm = {
        ...state.createShortCourseForm,
        ...action.payload,
      };
    },
    resetCreateShortCourseForm: (state) => {
      state.createShortCourseForm = initialState.createShortCourseForm;
    },

    updateShortCourseData: (
      state,
      action: PayloadAction<Partial<CourseData>>
    ) => {
      state.shortCourseData = {
        ...state.shortCourseData,
        ...action.payload,
      };
    },

    resetShortCourseData: (state) => {
      state.shortCourseData = initialState.shortCourseData;
    },
  },
});

export const {
  updatCreateLongCourseForm,
  resetCreateLongCourseForm,
  updateLongCourseData,
  resetLongCourseData,
  updatCreateShortCourseForm,
  resetCreateShortCourseForm,
  updateShortCourseData,
  resetShortCourseData,
} = courseStore.actions;
export default courseStore.reducer;
