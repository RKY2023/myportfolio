import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Destination } from "@/pages/api/locations/destinations";

export interface DestinationsResponse {
  count: number;
  results: Destination[];
}

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/locations",
    credentials: "include",
  }),
  tagTypes: ["Destination", "Destinations"],
  endpoints: (builder) => ({
    getDestinations: builder.query<DestinationsResponse, void>({
      query: () => "/destinations",
      providesTags: ["Destinations"],
    }),

    getDestination: builder.query<Destination, string>({
      query: (id) => `/destinations/${id}`,
      providesTags: (result, error, id) => [{ type: "Destination", id }],
    }),

    createDestination: builder.mutation<
      Destination,
      Partial<Destination>
    >({
      query: (destination) => ({
        url: "/destinations",
        method: "POST",
        body: destination,
      }),
      invalidatesTags: ["Destinations"],
    }),

    updateDestination: builder.mutation<
      Destination,
      { id: string; data: Partial<Destination> }
    >({
      query: ({ id, data }) => ({
        url: `/destinations/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Destination", id },
        "Destinations",
      ],
    }),

    deleteDestination: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/destinations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Destinations"],
    }),

    setActiveDestination: builder.mutation<Destination, string>({
      query: (id) => ({
        url: `/destinations/${id}`,
        method: "PATCH",
        body: { isActive: true },
      }),
      invalidatesTags: ["Destinations"],
    }),

    markDestinationArrived: builder.mutation<Destination, string>({
      query: (id) => ({
        url: `/destinations/${id}`,
        method: "PATCH",
        body: { arrivedAt: new Date().toISOString(), isActive: false },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Destination", id },
        "Destinations",
      ],
    }),
  }),
});

export const {
  useGetDestinationsQuery,
  useGetDestinationQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
  useSetActiveDestinationMutation,
  useMarkDestinationArrivedMutation,
} = locationApi;
