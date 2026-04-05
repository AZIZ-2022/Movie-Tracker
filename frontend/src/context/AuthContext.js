import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create the context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  // State to store user info
  const [user, setUser] = useState(null);
  
  // State to track loading
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when app loads
  useEffect(() => {
    const checkAuth = async () => {
      // Check if token exists
      if (authService.isAuthenticated()) {
        try {
          // Get user info from backend
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          // Token invalid, clear it
          authService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      await authService.login(username, password);
      
      // Get user info after login
      const userData = await authService.getCurrentUser();
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.detail || 'Login failed' 
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      // Set user from registration response
      setUser(response.user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.username || error.email || error.password || 'Registration failed' 
      };
    }
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // Values to share with all components
  const value = {
    user,           // Current user info
    loading,        // Is checking auth?
    login,          // Login function
    register,       // Register function
    logout,         // Logout function
    isAuthenticated: !!user,  // Boolean: is user logged in?
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
