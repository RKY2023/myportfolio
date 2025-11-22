import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { diaryApi } from "./api/diaryApi";
import { authApi } from "./api/authApi";
import { timelineApi } from "./api/timelineApi";

export const store = configureStore({
  reducer: {
    [diaryApi.reducerPath]: diaryApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [timelineApi.reducerPath]: timelineApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(diaryApi.middleware, authApi.middleware, timelineApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
