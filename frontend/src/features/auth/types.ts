export interface User {
  id: string;
  email: string;
  fullName: string | null;
  roles: string[];
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export interface ApiViolation {
  propertyPath: string;
  title?: string;
  message?: string;
}

export interface ApiErrorResponse {
  title?: string;
  detail?: string;
  status?: number;
  error?: string;
  violations?: ApiViolation[];
}
