import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type UploadFile = {
  mimeType: string;
  secureUrl: string;
};
const initialState = {
  uploadPostFileForm: {
    mimeType: "",
    secureUrl: "",
  } as UploadFile,
};

const uploadStore = createSlice({
  name: "uploadStore",
  initialState,
  reducers: {
    updatUploadPostFileForm: (
      state,
      action: PayloadAction<Partial<UploadFile>>
    ) => {
      state.uploadPostFileForm = {
        ...state.uploadPostFileForm,
        ...action.payload,
      };
    },
    resetUploadPostFileForm: (state) => {
      state.uploadPostFileForm = initialState.uploadPostFileForm;
    },
  },
});

export const { updatUploadPostFileForm, resetUploadPostFileForm } =
  uploadStore.actions;
export default uploadStore.reducer;
