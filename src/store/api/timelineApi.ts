import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TimelineEvent {
  id: number;
  userId: number;
  title: string;
  description?: string;
  eventType: string;
  status: "planned" | "ongoing" | "completed" | "cancelled";
  startDate: string;
  endDate?: string;
  location?: string;
  color: string;
  icon?: string;
  isMilestone: boolean;
  isPrivate: boolean;
  tags: any[];
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEventsResponse {
  count: number;
  results: TimelineEvent[];
  next?: string;
  previous?: string;
}

export interface FetchTimelineEventsParams {
  startDate?: string;
  endDate?: string;
  category?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export const timelineApi = createApi({
  reducerPath: "timelineApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/dairyentry",
    credentials: "include",
  }),
  tagTypes: ["TimelineEvent", "TimelineEvents"],
  endpoints: (builder) => ({
    getTimelineEvents: builder.query<TimelineEventsResponse, FetchTimelineEventsParams | void>({
      query: (params) => {
        if (!params) {
          return "/timeline-events/";
        }

        const searchParams = new URLSearchParams();
        if (params.startDate) searchParams.append("startDate", params.startDate);
        if (params.endDate) searchParams.append("endDate", params.endDate);
        if (params.category) searchParams.append("category", params.category);
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.page_size) searchParams.append("page_size", params.page_size.toString());
        if (params.ordering) searchParams.append("ordering", params.ordering);

        const queryString = searchParams.toString();
        return `/timeline-events/${queryString ? "?" + queryString : ""}`;
      },
      providesTags: ["TimelineEvents"],
    }),

    getTimelineEvent: builder.query<TimelineEvent, number>({
      query: (id) => `/timeline-events/${id}/`,
      providesTags: (result, error, id) => [{ type: "TimelineEvent", id }],
    }),

    createTimelineEvent: builder.mutation<TimelineEvent, Partial<TimelineEvent>>({
      query: (data) => ({
        url: "/timeline-events/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TimelineEvents"],
    }),

    updateTimelineEvent: builder.mutation<TimelineEvent, { id: number; data: Partial<TimelineEvent> }>({
      query: ({ id, data }) => ({
        url: `/timeline-events/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "TimelineEvent", id },
        "TimelineEvents",
      ],
    }),

    deleteTimelineEvent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/timeline-events/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["TimelineEvents"],
    }),
  }),
});

export const {
  useGetTimelineEventsQuery,
  useGetTimelineEventQuery,
  useCreateTimelineEventMutation,
  useUpdateTimelineEventMutation,
  useDeleteTimelineEventMutation,
} = timelineApi;
