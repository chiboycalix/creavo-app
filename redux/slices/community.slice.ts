import { CreateCommunityForm, CreateModuleForm } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  createCommunityForm: {
    name: "",
    description: "",
    logo: "",
  } as CreateCommunityForm,
};

const communityStore = createSlice({
  name: "communityStore",
  initialState,
  reducers: {
    updatCreateCommunityForm: (
      state,
      action: PayloadAction<Partial<CreateCommunityForm>>
    ) => {
      state.createCommunityForm = {
        ...state.createCommunityForm,
        ...action.payload,
      };
    },
    resetCreateCommunityForm: (state) => {
      state.createCommunityForm = initialState.createCommunityForm;
    },
  },
});

export const { updatCreateCommunityForm, resetCreateCommunityForm } =
  communityStore.actions;
export default communityStore.reducer;
