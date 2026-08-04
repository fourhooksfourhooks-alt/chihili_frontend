"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, getCurrentUser, refreshToken, user, loading } = useAuthStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (!token) {
          await refreshToken();  // refresh access token using HttpOnly cookie
        }
        await getCurrentUser();       // fetch /me with new token
      } catch (error) {
        console.error('Authentication failed:', error);
        router.replace("/auth/login");
      } finally {
        setIsInitialized(true);
      }
    };

    init();
  }, [token, refreshToken, getCurrentUser, router]);

  if (loading || !isInitialized) {
    return <LoadingSpinner color="border-primary1" />;
  }

  return user ? <>{children}</> : null;
}
