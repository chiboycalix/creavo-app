import { ModuleForm } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  createModuleForm: {
    title: "",
    description: "",
    difficultyLevel: "",
    media: [
      {
        url: "",
        title: "",
        description: "",
        mimeType: "",
      },
    ],
  },
};

const moduleStore = createSlice({
  name: "moduleStore",
  initialState,
  reducers: {
    updatCreateModuleForm: (
      state,
      action: PayloadAction<Partial<ModuleForm>>
    ) => {
      state.createModuleForm = {
        ...state.createModuleForm,
        ...action.payload,
        media: Array.isArray(action.payload.media)
          ? action.payload.media
          : state.createModuleForm.media,
      };
    },
    resetCreateModuleForm: (state) => {
      state.createModuleForm = initialState.createModuleForm;
    },
  },
});

export const { updatCreateModuleForm, resetCreateModuleForm } =
  moduleStore.actions;
export default moduleStore.reducer;
