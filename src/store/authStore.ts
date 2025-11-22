import { create } from "zustand";

export interface AuthState {
  isAuthenticated: boolean;
  isPasswordRequired: boolean;
  error?: string;
  loading: boolean;
}

export interface AuthActions {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsPasswordRequired: (isPasswordRequired: boolean) => void;
  setError: (error?: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  isAuthenticated: false,
  isPasswordRequired: false,
  error: undefined,
  loading: false,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setIsAuthenticated: (isAuthenticated) =>
    set({ isAuthenticated }),

  setIsPasswordRequired: (isPasswordRequired) =>
    set({ isPasswordRequired }),

  setError: (error) =>
    set({ error }),

  setLoading: (loading) =>
    set({ loading }),

  reset: () =>
    set(initialState),
}));
