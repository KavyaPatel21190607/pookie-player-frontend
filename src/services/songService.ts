import api from './api';

// Song API Service
export const songService = {
  // Get all songs
  getAllSongs: async () => {
    try {
      const response = await api.get('/songs');
      return response.data;
    } catch (error: any) {
      console.error('Get all songs error:', error);
      throw error;
    }
  },

  // Get single song by ID
  getSongById: async (id: string) => {
    try {
      const response = await api.get(`/songs/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get song error:', error);
      throw error;
    }
  },

  // Sync songs from Supabase storage (Admin only)
  syncSongs: async () => {
    try {
      const response = await api.post('/songs/sync');
      return response.data;
    } catch (error: any) {
      console.error('Sync songs error:', error);
      throw error;
    }
  },

  // Create new song (Admin only)
  createSong: async (songData: any) => {
    try {
      const response = await api.post('/songs', songData);
      return response.data;
    } catch (error: any) {
      console.error('Create song error:', error);
      throw error;
    }
  },

  // Update song (Admin only)
  updateSong: async (id: string, songData: any) => {
    try {
      const response = await api.put(`/songs/${id}`, songData);
      return response.data;
    } catch (error: any) {
      console.error('Update song error:', error);
      throw error;
    }
  },

  // Delete song (Admin only)
  deleteSong: async (id: string) => {
    try {
      const response = await api.delete(`/songs/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete song error:', error);
      throw error;
    }
  }
};
