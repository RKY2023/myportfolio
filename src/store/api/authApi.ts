import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AuthResponse {
  authenticated: boolean;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/my",
    credentials: "include",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    checkAuth: builder.query<AuthResponse, void>({
      query: () => "/check-auth",
      providesTags: ["Auth"],
    }),

    authenticate: builder.mutation<AuthResponse, { password: string }>({
      query: (data) => ({
        url: "/authenticate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useCheckAuthQuery, useAuthenticateMutation } = authApi;
