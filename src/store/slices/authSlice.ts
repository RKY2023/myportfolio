import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticated: boolean;
  isPasswordRequired: boolean;
  error?: string;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isPasswordRequired: false,
  error: undefined,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setIsPasswordRequired: (state, action: PayloadAction<boolean>) => {
      state.isPasswordRequired = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    resetAuth: (state) => {
      state.isAuthenticated = false;
      state.isPasswordRequired = false;
      state.error = undefined;
      state.loading = false;
    },
  },
});

export const {
  setIsAuthenticated,
  setIsPasswordRequired,
  setAuthError,
  setAuthLoading,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;
