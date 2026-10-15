import type { ApiErrorResponse, LoginCredentials, RegisterCredentials, User } from './types';

const BACKEND_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/+$/, '');

export class AuthApiError extends Error {
  public status: number;
  public details?: ApiErrorResponse;

  constructor(message: string, status: number, details?: ApiErrorResponse) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
    this.details = details;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const errorData = data as ApiErrorResponse | null;
    let message = 'An unexpected error occurred.';

    if (errorData?.detail) {
      message = errorData.detail;
    } else if (errorData?.error) {
      message = errorData.error;
    } else if (errorData?.title) {
      message = errorData.title;
    } else if (errorData?.violations && errorData.violations.length > 0) {
      message = errorData.violations
        .map((v) => v.message || v.title)
        .filter(Boolean)
        .join(', ');
    } else if (res.status === 401) {
      message = 'Invalid email or password.';
    } else if (res.status === 403) {
      message = 'Access denied.';
    }

    throw new AuthApiError(message, res.status, errorData ?? undefined);
  }

  return data as T;
}

export async function loginUser(credentials: LoginCredentials): Promise<User> {
  const res = await fetch(`${BACKEND_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      email: credentials.email.trim(),
      password: credentials.password,
    }),
  });

  await handleResponse(res);

  // After session is established, fetch current user info
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthApiError('Failed to retrieve user session after login.', 401);
  }

  return user;
}

export async function registerUser(credentials: RegisterCredentials): Promise<User> {
  const res = await fetch(`${BACKEND_URL}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      email: credentials.email.trim(),
      password: credentials.password,
      fullName: credentials.fullName?.trim() || undefined,
    }),
  });

  return handleResponse<User>(res);
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Ignore logout errors if session already expired
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (res.status === 401 || res.status === 403) {
      return null;
    }

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as User;
  } catch {
    return null;
  }
}
