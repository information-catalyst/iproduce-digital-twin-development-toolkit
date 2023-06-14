import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { bpmnApi } from "../services/bpmn";
import { modelApi } from "../services/model";
import bpmnReducer from "../slices/bpmnSlice";
import modelReducer from "../slices/3dModel";

export const store = configureStore({
  reducer: {
    [bpmnApi.reducerPath]: bpmnApi.reducer,
    [modelApi.reducerPath]: modelApi.reducer,
    bpmn: bpmnReducer,
    model: modelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([bpmnApi.middleware, modelApi.middleware]),
});

setupListeners(store.dispatch);
