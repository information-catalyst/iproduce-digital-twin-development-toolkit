import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jsonContent: "",
  fileName: "",
};

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setJSONContent: (state, action) => {
      state.jsonContent = action.payload;
    },
    setFileName: (state, action) => {
      state.fileName = action.payload;
    },
  },
});

export const { setJSONContent, setFileName } = modelSlice.actions;

export default modelSlice.reducer;
