import { CreateSpaceForm } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  createSpaceForm: {
    name: "",
    description: "",
    logo: "",
  } as CreateSpaceForm,
};

const spaceStore = createSlice({
  name: "spaceStore",
  initialState,
  reducers: {
    updateCreateSpaceForm: (
      state,
      action: PayloadAction<Partial<CreateSpaceForm>>
    ) => {
      state.createSpaceForm = {
        ...state.createSpaceForm,
        ...action.payload,
      };
    },
    resetCreateSpaceForm: (state) => {
      state.createSpaceForm = initialState.createSpaceForm;
    },
  },
});

export const { updateCreateSpaceForm, resetCreateSpaceForm } =
  spaceStore.actions;
export default spaceStore.reducer;
