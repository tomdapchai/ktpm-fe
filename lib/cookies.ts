"use server"
import { cookies as nextCookies } from 'next/headers';
import { TOKEN_KEY, ROLE_KEY } from './api/auth-api';
export const logout = async (): Promise<void> => {
    // cookies.remove(TOKEN_KEY, { path: '/' });
    // cookies.remove(ROLE_KEY, { path: '/' });
    // serverside cookies.remove(TOKEN_KEY, { path: '/' });
  
  
    (await nextCookies()).delete(TOKEN_KEY);
    (await nextCookies()).delete(ROLE_KEY);
    console.log("Logged out and cookies removed");
  };
  
  export const getToken = async (): Promise<string | null> => {
    try {
      
        // Server-side: use Next.js cookies API
        try {
          // This might throw in middleware context
          const token = (await nextCookies()).get(TOKEN_KEY)?.value || null;
          console.log("Server-side token retrieved:", token ? "Found" : "Not found");
          return token;
        } catch (e) {
          console.log("Error retrieving server-side token, likely in middleware context:", e);
          return null;
        }
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };