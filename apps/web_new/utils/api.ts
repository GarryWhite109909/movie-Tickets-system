import { redirect } from 'next/navigation';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
export const SUCCESS_CODE = 1;

/**
 * Enhanced fetcher utility for Next.js 14+
 * Handles authentication redirection, error parsing, and flexible caching options.
 */
export async function fetcher<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
  // Default to 'no-store' but allow overriding via options
  const { cache = 'no-store', ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${url}`, {
    cache,
    ...rest,
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      // Client-side: Redirect to login
      window.location.href = '/login';
      // Return a pending promise or reject to halt execution flow
      throw new Error('Unauthorized'); 
    } else {
      // Server-side: Use Next.js redirect
      redirect('/login');
    }
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    // If JSON parsing fails but response was not OK, throw status error
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    throw new Error('Invalid JSON response');
  }

  if (!response.ok) {
    // Attempt to parse structured error message
    // Expected format: { code, msg, data }
    const record = typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : null;
    const errorMsg =
      (record && (typeof record.msg === 'string' ? record.msg : undefined)) ||
      (record && (typeof record.message === 'string' ? record.message : undefined)) ||
      `Request failed with status ${response.status}`;

    const err = new Error(errorMsg) as Error & { code?: unknown; data?: unknown; status?: number };
    if (record) {
      err.code = record.code;
      err.data = record.data;
    }
    err.status = response.status;
    throw err;
  }

  return data as T;
}
