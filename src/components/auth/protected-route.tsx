"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/') {
          sessionStorage.setItem('redirectAfterLogin', currentPath);
        }
      }
      router.push(redirectTo);
      return;
    }

    if (status === "authenticated" && typeof window !== 'undefined') {
      sessionStorage.removeItem('redirectAfterLogin');
    }
  }, [status, router, redirectTo]);

  // Show loading spinner while checking auth status
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // If not authenticated, don't render children (will redirect in useEffect)
  if (status === "unauthenticated") {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
}
