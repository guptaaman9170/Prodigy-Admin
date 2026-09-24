"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, LoginCredentials } from "@/types/auth";
import { authService } from "@/services/authService";
import { productService } from "@/services/productService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Load existing credentials on mount
  useEffect(() => {
    try {
      const storedToken = authService.getToken();
      const storedUser = authService.getCurrentUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (err) {
      console.error("Error reading stored credentials:", err);
    } finally {
      setIsLoading(false);
    }

    // Listen for global unauthorized events dispatched from Axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      router.push("/login?expired=1");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [router]);

  // Login handler with debounce/double-click lock
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      // Prevent multiple concurrent submissions
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        const loggedUser = await authService.login(credentials);
        setUser(loggedUser);
        setToken(loggedUser.accessToken);
        router.push("/products");
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, router]
  );

  // Logout handler
  const logout = useCallback(() => {
    productService.clearCache();
    authService.logout();
    setUser(null);
    setToken(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        isSubmitting,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
