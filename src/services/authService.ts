import apiClient, { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "@/lib/axios";
import { LoginCredentials, User } from "@/types/auth";

export const authService = {
  /**
   * Authenticates the user with DummyJSON auth endpoint via resilient route
   */
  async login(credentials: LoginCredentials): Promise<User> {
    let user: User | null = null;

    // 1. Authenticate via server-side proxy (eliminates browser CORS preflight latency & adblock hangs)
    try {
      const proxyRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (proxyRes.ok) {
        user = await proxyRes.json();
      } else {
        const errorData = await proxyRes.json().catch(() => null);
        throw new Error(
          errorData?.message || "Invalid credentials. Please verify your username and password."
        );
      }
    } catch (proxyError: unknown) {
      const errorMsg = proxyError instanceof Error ? proxyError.message : "";
      if (errorMsg.includes("Invalid credentials")) {
        throw proxyError;
      }

      // 2. Direct fallback to apiClient if proxy is unreachable
      const directRes = await apiClient.post<User>("/auth/login", credentials, {
        timeout: 15000,
      });
      user = directRes.data;
    }

    if (!user) {
      throw new Error("Unable to complete authentication. Please try again.");
    }

    if (typeof window !== "undefined" && user.accessToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, user.accessToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      // Also set standard cookie so server/middleware can detect session if needed
      document.cookie = `prodigy_token=${user.accessToken}; path=/; max-age=86400; SameSite=Lax`;
    }

    return user;
  },

  /**
   * Retrieves the currently stored user from localStorage
   */
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  },

  /**
   * Retrieves the auth token from localStorage
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  /**
   * Clears all session credentials
   */
  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    document.cookie = "prodigy_token=; path=/; max-age=0";
    window.dispatchEvent(new CustomEvent("auth:logout"));
  },
};
