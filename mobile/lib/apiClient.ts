import { QueryClient } from '@tanstack/react-query';

// Base URL for API requests - in a real app, this would be your server URL
// For testing on Expo, we'd use the local network IP instead of localhost
const API_BASE_URL = 'http://192.168.1.100:5000';

// Function to throw error if response is not OK
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || 'Something went wrong';
    throw new Error(errorMessage);
  }
}

// Generic API request function
export async function apiRequest<T>(
  method: string,
  endpoint: string,
  data?: any
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(url, config);
  await throwIfResNotOk(response);
  
  // For DELETE requests that return 204 No Content
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

// Create query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});