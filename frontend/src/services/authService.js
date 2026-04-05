import api from './api';

// Authentication Service
const authService = {
  // Register new user
  // Register new user
register: async (userData) => {
  try {
    console.log('Sending registration data:', userData);
    const response = await api.post('/auth/register/', userData);
    
    // Save tokens to localStorage
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
    }
    
    return response.data;
  } catch (error) {
    console.error('Full registration error:', error);
    console.error('Error response data:', error.response?.data);
    throw error.response?.data || error.message;
  }
},

  // Login user
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login/', {
        username,
        password,
      });
      
      // Save tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      // Call logout endpoint to blacklist token
      await api.post('/auth/logout/', {
        refresh: refreshToken,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove tokens from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/profile/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.patch('/auth/profile/update/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    return !!token; // Returns true if token exists
  },
};

export default authService;