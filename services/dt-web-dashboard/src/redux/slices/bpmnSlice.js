import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  xmlcontent: "",
  fileName: "",
};

export const bpmnSlice = createSlice({
  name: "bpmn",
  initialState,
  reducers: {
    setXmlContent: (state, action) => {
      state.xmlcontent = action.payload;
    },
    setFileName: (state, action) => {
      state.fileName = action.payload;
    },
  },
});

export const { setXmlContent, setFileName } = bpmnSlice.actions;

export default bpmnSlice.reducer;
