import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bpmnApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://dash-api:3000/api" }),
  endpoints: (builder) => ({
    upload: builder.mutation({
      query: ({ database, process, xmlData }) => ({
        url: `${database}/${process}`,
        method: "PUT",
        headers: {
          Authorization: "Basic YWRtaW46YWRtaW4=",
          "Content-Type": "application/json",
        },
        body: { xmlData },
      }),
    }),
  }),
});

export const { useUploadMutation } = bpmnApi;
