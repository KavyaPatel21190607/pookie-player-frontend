import api from './api';

// Auth API Service
export const authService = {
  // Register new user
  register: async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Save token and user to localStorage
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Save token and user to localStorage
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  },

  // Get current user
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch user data' };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error: any) {
      // Clear localStorage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      throw error.response?.data || { success: false, message: 'Logout failed' };
    }
  },

  // Update password
  updatePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
    try {
      const response = await api.put('/auth/update-password', passwords);
      
      // Update token
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Password update failed' };
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get stored user
  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get stored token
  getStoredToken: (): string | null => {
    return localStorage.getItem('token');
  }
};
