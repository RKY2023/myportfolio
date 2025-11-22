import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export interface DiaryEntry {
  id: number;
  title: string;
  content?: string;
  entryDate: string;
  entryTime?: string;
  mood?: string;
  moodScore?: number;
  weather?: string;
  location?: string;
  tags: any[];
  visibility: "private" | "public" | "friends";
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryEntriesResponse {
  count: number;
  results: DiaryEntry[];
  next?: string;
  previous?: string;
}

export interface FetchDiaryEntriesParams {
  startDate?: string;
  endDate?: string;
  mood?: string;
  tags?: number[];
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export const diaryApi = createApi({
  reducerPath: "diaryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/dairyentry",
    credentials: "include",
  }),
  tagTypes: ["DiaryEntry", "DiaryEntries"],
  endpoints: (builder) => ({
    getDiaryEntries: builder.query<DiaryEntriesResponse, FetchDiaryEntriesParams | void>({
      query: (params) => {
        if (!params) {
          return "/diary-entries/";
        }

        const searchParams = new URLSearchParams();
        if (params.startDate) searchParams.append("startDate", params.startDate);
        if (params.endDate) searchParams.append("endDate", params.endDate);
        if (params.mood) searchParams.append("mood", params.mood);
        if (params.tags?.length) searchParams.append("tags", params.tags.join(","));
        if (params.search) searchParams.append("search", params.search);
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.page_size) searchParams.append("page_size", params.page_size.toString());
        if (params.ordering) searchParams.append("ordering", params.ordering);

        const queryString = searchParams.toString();
        return `/diary-entries/${queryString ? "?" + queryString : ""}`;
      },
      providesTags: ["DiaryEntries"],
    }),

    getDiaryEntry: builder.query<DiaryEntry, number>({
      query: (id) => `/diary-entries/${id}/`,
      providesTags: (result, error, id) => [{ type: "DiaryEntry", id }],
    }),

    createDiaryEntry: builder.mutation<DiaryEntry, Partial<DiaryEntry>>({
      query: (data) => ({
        url: "/diary-entries/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DiaryEntries"],
    }),

    updateDiaryEntry: builder.mutation<DiaryEntry, { id: number; data: Partial<DiaryEntry> }>({
      query: ({ id, data }) => ({
        url: `/diary-entries/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DiaryEntry", id },
        "DiaryEntries",
      ],
    }),

    deleteDiaryEntry: builder.mutation<void, number>({
      query: (id) => ({
        url: `/diary-entries/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["DiaryEntries"],
    }),

    getDiaryEntriesByMonth: builder.query<DiaryEntry[], { year: number; month: number }>({
      query: ({ year, month }) => {
        const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
        const endDate = new Date(year, month, 0).toISOString().split("T")[0];
        return `/diary-entries/?startDate=${startDate}&endDate=${endDate}&page_size=100&ordering=-entryDate`;
      },
      transformResponse: (response: DiaryEntriesResponse) => response.results,
      providesTags: ["DiaryEntries"],
    }),

    checkDateHasEntries: builder.query<boolean, Date>({
      query: (date) => {
        const dateStr = date.toISOString().split("T")[0];
        return `/diary-entries/?startDate=${dateStr}&endDate=${dateStr}&page_size=1`;
      },
      transformResponse: (response: DiaryEntriesResponse) => response.count > 0,
      providesTags: ["DiaryEntries"],
    }),
  }),
});

export const {
  useGetDiaryEntriesQuery,
  useGetDiaryEntryQuery,
  useCreateDiaryEntryMutation,
  useUpdateDiaryEntryMutation,
  useDeleteDiaryEntryMutation,
  useGetDiaryEntriesByMonthQuery,
  useCheckDateHasEntriesQuery,
} = diaryApi;
