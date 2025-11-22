"use client";

import { ReactNode, useEffect, useState } from "react";
import { PersistGate as ReduxPersistGate } from "redux-persist/integration/react";
import { Persistor } from "redux-persist";

interface PersistGateWrapperProps {
  children: ReactNode;
  persistor: Persistor;
}

/**
 * SSR-safe wrapper around PersistGate
 * Prevents hydration mismatches by only rendering PersistGate on client-side
 * and after initial mount to avoid SSR/hydration conflicts
 */
export const PersistGateWrapper: React.FC<PersistGateWrapperProps> = ({
  children,
  persistor,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR and initial hydration, render children directly
  // without PersistGate to avoid hydration mismatches
  if (!isMounted) {
    return <>{children}</>;
  }

  // On client-side after hydration, wrap with PersistGate for persistence
  return (
    <ReduxPersistGate loading={null} persistor={persistor}>
      {children}
    </ReduxPersistGate>
  );
};
