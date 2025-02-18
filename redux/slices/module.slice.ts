import { CreateModuleForm } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  createModuleForm: {
    moduleTitle: "",
  } as CreateModuleForm,
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
  },
});

export const { updatCreateModuleForm, resetCreateModuleForm } =
  moduleStore.actions;
export default moduleStore.reducer;
