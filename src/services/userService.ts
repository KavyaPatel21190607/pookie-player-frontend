import api from './api';

// User API Service
export const userService = {
  // Get user profile
  getProfile: async () => {
    try {
      console.log('Fetching user profile...');
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      const response = await api.get('/users/profile');
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData: { name?: string; email?: string; avatar?: string }) => {
    try {
      const response = await api.put('/users/profile', profileData);
      
      // Update stored user
      if (response.data.success) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const updatedUser = { ...user, ...response.data.data.user };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to update profile' };
    }
  },

  // Delete user account
  deleteAccount: async () => {
    try {
      const response = await api.delete('/users/profile');
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to delete account' };
    }
  },

  // Get favorites
  getFavorites: async () => {
    try {
      const response = await api.get('/users/favorites');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch favorites' };
    }
  },

  // Add song to favorites
  addToFavorites: async (songId: string) => {
    try {
      const response = await api.post(`/users/favorites/${songId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to add to favorites' };
    }
  },

  // Remove song from favorites
  removeFromFavorites: async (songId: string) => {
    try {
      const response = await api.delete(`/users/favorites/${songId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to remove from favorites' };
    }
  }
};
