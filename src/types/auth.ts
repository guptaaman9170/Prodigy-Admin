export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
