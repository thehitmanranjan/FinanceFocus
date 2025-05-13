import { QueryClient } from '@tanstack/react-query';

// Base API URL - would be configurable in a real app
const API_BASE_URL = 'http://localhost:3000'; // For dev environment

/**
 * Helper to throw errors for non-2xx responses
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage;
    try {
      const data = await res.json();
      errorMessage = data.message || data.error || res.statusText;
    } catch (err) {
      errorMessage = res.statusText;
    }
    throw new Error(errorMessage);
  }
}

/**
 * Generic API request function
 */
export async function apiRequest<T>(
  method: string,
  endpoint: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...options,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  await throwIfResNotOk(response);
  
  // For 204 No Content, return null
  if (response.status === 204) {
    return null as T;
  }

  return await response.json();
}

/**
 * Configure the QueryClient with default options
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});