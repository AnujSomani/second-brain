import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("🔐 ProtectedRoute: Starting authentication check...");
      
      // Check if cookie exists
      const cookies = document.cookie;
      console.log("🍪 Cookies:", cookies);
      
      try {
        console.log("📡 Making API call to /api/v1/content...");
        const response = await api.get("/api/v1/content?page=1&limit=1");
        console.log("✅ Authentication successful!", response.data);
        setIsAuthenticated(true);
      } catch (err: any) {
        console.error("❌ Authentication check failed!");
        console.error("Error:", err);
        console.error("Response status:", err.response?.status);
        console.error("Response data:", err.response?.data);
        setError(err.response?.data?.message || err.message);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Loading state
  if (isAuthenticated === null) {
    console.log("⏳ ProtectedRoute: Loading...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-page">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-sm text-muted">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to signin
  if (!isAuthenticated) {
    console.log("🚫 Not authenticated, redirecting to signin");
    console.log("Error was:", error);
    return <Navigate to="/signin" replace />;
  }

  // Authenticated - render children
  console.log("✅ Authenticated! Rendering protected content");
  return <>{children}</>;
}
