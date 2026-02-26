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
    console.log("🛡️ ProtectedRoute - Auth status:", status);
    console.log("🛡️ ProtectedRoute - Session:", session);
    
    if (status === "loading") return; // Still loading, don't do anything yet

    if (status === "unauthenticated") {
      console.log("🚪 User not authenticated, redirecting to:", redirectTo);
      // Store the current path for redirect after login
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        console.log("📍 Storing current path:", currentPath);
        if (currentPath !== '/login' && currentPath !== '/') {
          sessionStorage.setItem('redirectAfterLogin', currentPath);
        }
      }
      router.push(redirectTo);
      return;
    }

    // If authenticated, clear any stored redirect
    if (status === "authenticated" && typeof window !== 'undefined') {
      console.log("✅ User authenticated, clearing stored redirect");
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
  console.log("🎉 Rendering protected content");
  return <>{children}</>;
}
