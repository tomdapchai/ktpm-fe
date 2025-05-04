import axios from 'axios';
import { getToken } from './cookies';
import { headers as getHeaders } from 'next/headers';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  // Increase timeout if needed
  timeout: 10000,
});

// Debug function to examine token in detail
const debugToken = async () => {
  try {
    const token = await getToken();
    console.log("=== TOKEN DEBUG INFO ===");
    console.log("Token exists:", !!token);
    console.log("Token length:", token ? token.length : 0);
    if (token) {
      console.log("Token prefix:", token.substring(0, 20) + '...');
      
      try {
        // Check if we can decode the token (basic validation)
        const parts = token.split('.');
        if (parts.length === 3) {
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          console.log("Token header:", header);
          console.log("Token payload:", payload);
          
          // Check if token is expired
          if (payload.exp) {
            const expiryDate = new Date(payload.exp * 1000);
            const now = new Date();
            console.log("Token expires:", expiryDate.toLocaleString());
            console.log("Token expired:", expiryDate < now);
          }
        }
      } catch (e) {
        console.log("Failed to decode token:", e);
      }
    }
    console.log("=== END TOKEN DEBUG ===");
    return token;
  } catch (error) {
    console.error("Error in debugToken:", error);
    return null;
  }
};

// Get token from request headers if available (for server components/API routes)
const getTokenFromRequestHeaders = async () => {
  try {
    if (typeof window === 'undefined') {
      // Only run on server
      try {
        const headersList = getHeaders();
        const authHeader = (await headersList).get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          return authHeader.substring(7);
        }
      } catch (e) {
        console.log("Not in a middleware/server component context where headers are available");
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Add request interceptor to include authorization header
api.interceptors.request.use(
  async (config) => {
    console.log(`\n🔒 Auth check for ${config.url || 'request'}`);
    
    // First try cookie token
    let token = await debugToken();
    
    // If no token from cookies, try request headers (for server components)
    if (!token) {
      token = await getTokenFromRequestHeaders();
      if (token) console.log("Retrieved token from request headers");
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Authorization header set");
    } else {
      console.log("⚠️ No token found - request will proceed without Authorization header");
    }
    
    // Log the full request URL for debugging
    console.log(`📡 Making request to: ${config.baseURL}${config.url}`);
    console.log('📋 Request headers:', config.headers);
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
