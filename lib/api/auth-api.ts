
import { Cookies } from 'react-cookie';
// Import for server-side cookie handling

const cookies = new Cookies();
export const TOKEN_KEY = 'auth_token';
export const ROLE_KEY = 'user_role';

export type UserRole = 'ADMIN' | 'STAFF' | 'PATIENT';

interface LoginResponse {
  status: number;
  message: string; // JWT token
  data: any | null;
}

export const login = async (
  username: string, 
  password: string, 
  role: UserRole
): Promise<boolean> => {
  try {
    let endpoint = '';
    
    // Ensure we're using the /api prefix for API routes
    switch (role.toUpperCase()) {
      case 'ADMIN':
        endpoint = '/api/auth/admin/login';
        break;
      case 'STAFF':
        endpoint = '/api/auth/staff/login';
        break;
      case 'PATIENT':
        endpoint = '/api/auth/patient/login';
        break;
      default:
        throw new Error('Invalid role specified');
    }

    console.log("Login endpoint:", endpoint);

    // Use absolute URL to ensure we're hitting the API route
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        subject: username, 
        password 
      }),
      // Add these options to avoid using cached responses
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('Login failed with status:', response.status);
      return false;
    }
    
    const data = await response.json() as LoginResponse;
    console.log("Login response data:", data);

    if (data && data.status === 200) {
      // Store token in cookie
      cookies.set(TOKEN_KEY, data.message, { 
        path: '/',
        maxAge: 8 * 60 * 60, // 8 hours
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      
      // Store user role
      cookies.set(ROLE_KEY, role, {
        path: '/',
        maxAge: 8 * 60 * 60, // 8 hours
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });

      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

const getToken = (): string | null => {
  const token = cookies.get(TOKEN_KEY) || null;
  return token
}

export const getUserRole = async (): Promise<UserRole | null> => {
  return cookies.get(ROLE_KEY) || null;
};

export const isAuthenticated = async (): Promise<boolean> => {
  return !!getToken();
};

export const hasRole = async (requiredRole: UserRole): Promise<boolean> => {
  const userRole = await getUserRole();
  return userRole === requiredRole;
};
