import { AddMediaToModule, CreateModuleForm } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  createModuleForm: {
    courseId: "",
    title: "",
    description: "",
    difficultyLevel: "",
  },
  selectedModuleData: {} as any,
  addMediaToModuleForm: {
    url: "",
    title: "",
    description: "",
    mimeType: "",
    mediaLength: 0,
  },
};

const moduleStore = createSlice({
  name: "moduleStore",
  initialState,
  reducers: {
    updatCreateModuleForm: (
      state,
      action: PayloadAction<Partial<CreateModuleForm>>
    ) => {
      state.createModuleForm = {
        ...state.createModuleForm,
        ...action.payload,
      };
    },
    resetCreateModuleForm: (state) => {
      state.createModuleForm = initialState.createModuleForm;
    },

    updateAddMediaToModuleForm: (
      state,
      action: PayloadAction<Partial<any>>
    ) => {
      state.addMediaToModuleForm = {
        ...state.addMediaToModuleForm,
        ...action.payload,
      };
    },
    resetAddMediaToModuleForm: (state) => {
      state.addMediaToModuleForm = initialState.addMediaToModuleForm;
    },

    updateSelectedModuleData: (state, action: PayloadAction<Partial<any>>) => {
      state.selectedModuleData = {
        ...state.selectedModuleData,
        ...action.payload,
      };
    },
    resetSelectedModuleData: (state) => {
      state.selectedModuleData = initialState.selectedModuleData;
    },
  },
});

export const {
  updatCreateModuleForm,
  resetCreateModuleForm,
  updateAddMediaToModuleForm,
  resetAddMediaToModuleForm,
  updateSelectedModuleData,
  resetSelectedModuleData,
} = moduleStore.actions;
export default moduleStore.reducer;
