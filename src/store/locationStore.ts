import { create } from "zustand";

export interface LocationCoordinates {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

export type PermissionStatus = 'prompt' | 'granted' | 'denied' | 'unsupported';

export interface LocationState {
  currentLocation: LocationCoordinates | null;
  isTracking: boolean;
  error: string | null;
  permissionStatus: PermissionStatus;
  watchId: number | null;
}

export interface LocationActions {
  setCurrentLocation: (location: LocationCoordinates | null) => void;
  setIsTracking: (isTracking: boolean) => void;
  setError: (error: string | null) => void;
  setPermissionStatus: (status: PermissionStatus) => void;
  setWatchId: (watchId: number | null) => void;
  reset: () => void;
}

export type LocationStore = LocationState & LocationActions;

const initialState: LocationState = {
  currentLocation: null,
  isTracking: false,
  error: null,
  permissionStatus: 'prompt',
  watchId: null,
};

export const useLocationStore = create<LocationStore>((set) => ({
  ...initialState,

  setCurrentLocation: (currentLocation) =>
    set({ currentLocation }),

  setIsTracking: (isTracking) =>
    set({ isTracking }),

  setError: (error) =>
    set({ error }),

  setPermissionStatus: (permissionStatus) =>
    set({ permissionStatus }),

  setWatchId: (watchId) =>
    set({ watchId }),

  reset: () =>
    set(initialState),
}));
