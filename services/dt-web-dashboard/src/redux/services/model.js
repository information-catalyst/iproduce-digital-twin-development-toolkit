import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const modelApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://dash-api:3000/api" }),
  endpoints: (builder) => ({
    uploadModel: builder.mutation({
      query: (file) => ({
        url: "/upload",
        method: "POST",
        body: file,
      }),
    }),
  }),
});

export const { useUploadModelMutation } = modelApi;
