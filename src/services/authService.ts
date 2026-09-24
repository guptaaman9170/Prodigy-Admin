import apiClient, { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "@/lib/axios";
import { LoginCredentials, User } from "@/types/auth";

export const authService = {
  /**
   * Authenticates the user with DummyJSON /auth/login endpoint
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const doLogin = async () => {
      const response = await apiClient.post<User>("/auth/login", credentials, {
        timeout: 30000,
      });
      return response.data;
    };

    let user: User;
    try {
      user = await doLogin();
    } catch (err: unknown) {
      // Auto-retry once on network/timeout error
      const isTransient =
        err instanceof Error &&
        (err.message.includes("timeout") ||
          err.message.includes("Network") ||
          err.message.includes("ECONNABORTED"));

      if (isTransient) {
        user = await doLogin();
      } else {
        throw err;
      }
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
