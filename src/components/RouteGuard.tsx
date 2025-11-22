"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { routes, protectedRoutes } from "@/app/resources";
import { Button, Heading, Column, PasswordInput } from "@/once-ui/components";
import NotFound from "@/app/not-found";
import { logger } from "@/utils/logger";
import { errorHandler } from "@/utils/errorHandler";
import { useAuthStore } from "@/store/authStore";

interface RouteGuardProps {
	children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const { isAuthenticated, isPasswordRequired, error, loading } = useAuthStore();
  const { setIsAuthenticated, setIsPasswordRequired, setError, setLoading } = useAuthStore();

  const [isRouteEnabled, setIsRouteEnabled] = useState(true);
  const [password, setPassword] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoized helper function to check if route is in /my/* namespace
  const isMyRoute = useCallback((path: string | null) => {
    return path?.startsWith("/my") ?? false;
  }, []);

  // Memoized auth endpoint determination
  const authEndpoint = useMemo(() => {
    return isMyRoute(pathname) ? "/api/my/check-auth" : "/api/check-auth";
  }, [pathname, isMyRoute]);

  const checkRouteEnabled = useCallback(() => {
    if (!pathname) return true;

    if (pathname in routes) {
      return routes[pathname as keyof typeof routes];
    }

    const dynamicRoutes = ["/blog", "/work"] as const;
    for (const route of dynamicRoutes) {
      if (pathname?.startsWith(route) && routes[route]) {
        return true;
      }
    }

    return true;
  }, [pathname]);

  useEffect(() => {
    const performChecks = async () => {
      try {
        setLoading(true);

        const routeEnabled = checkRouteEnabled();
        setIsRouteEnabled(routeEnabled);
        logger.debug(`Route check for "${pathname}"`, { isEnabled: routeEnabled }, 'RouteGuard');

        if (protectedRoutes[pathname as keyof typeof protectedRoutes]) {
          setIsPasswordRequired(true);

          const response = await fetch(authEndpoint);
          if (response.ok) {
            setIsAuthenticated(true);
            logger.info(`User authenticated for route "${pathname}"`, undefined, 'RouteGuard');
          }
        }
      } catch (err) {
        errorHandler.handle(err instanceof Error ? err : new Error(String(err)), 'RouteGuard');
      } finally {
        setLoading(false);
      }
    };

    performChecks();
  }, [pathname, checkRouteEnabled, authEndpoint]);

  const handlePasswordSubmit = useCallback(async () => {
    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    try {
      const submitEndpoint = isMyRoute(pathname) ? "/api/my/authenticate" : "/api/authenticate";

      const response = await fetch(submitEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setError(undefined);
        logger.info(`Authentication successful for route "${pathname}"`, undefined, 'RouteGuard');
      } else {
        setError("Incorrect password");
        errorHandler.logAuthError("Invalid password attempt", 'RouteGuard');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setError(message);
      errorHandler.handle(err instanceof Error ? err : new Error(message), 'RouteGuard');
    }
  }, [pathname, isMyRoute, password]);

  // Render children immediately to avoid hydration mismatch
  // Route and auth checks happen in background
  if (isPasswordRequired && !isAuthenticated && isMounted) {
    return (
      <Column paddingY="128" maxWidth={24} gap="24" center>
        <Heading align="center" wrap="balance">
          This page is password protected
        </Heading>
        <Column fillWidth gap="8" horizontal="center">
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage={error}
          />
          <Button onClick={handlePasswordSubmit}>Submit</Button>
        </Column>
      </Column>
    );
  }

  if (!isRouteEnabled && !loading && isMounted) {
		return <NotFound />;
	}

  return <>{children}</>;
};

export { RouteGuard };
