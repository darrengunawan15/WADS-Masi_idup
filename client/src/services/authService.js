import axios from 'axios';

const API_URL = '/api/users/'; // Adjust if your user API base URL is different

// Helper function to get auth header
const authHeader = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    // Store user and tokens in localStorage
    localStorage.setItem('user', JSON.stringify(response.data));
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    // Store user and tokens in localStorage
    localStorage.setItem('user', JSON.stringify(response.data));
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  }

  return response.data;
};

// Logout user
const logout = async (refreshToken) => {
    // Optionally send refresh token to backend for invalidation
    await axios.post(API_URL + 'logout', { refreshToken });

    // Remove user and tokens from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

// Refresh access token
const refreshAccessToken = async (refreshToken) => {
    const response = await axios.post(API_URL + 'refresh', { refreshToken });

    if (response.data && response.data.accessToken) {
        // Update only the access token in localStorage
        localStorage.setItem('accessToken', response.data.accessToken);
        return response.data.accessToken;
    }
    return null; // Indicate failure
};

// Update user profile
const updateProfile = async (formData, token) => {
  try {
    console.log('Auth Service - Starting profile update...');
    console.log('Auth Service - Token available:', !!token);
    
    if (!token) {
      throw new Error('No authentication token provided');
    }

    const config = {
      ...authHeader(token),
      headers: {
        ...authHeader(token).headers,
        'Content-Type': 'multipart/form-data',
      },
    };

    console.log('Auth Service - Sending request to:', API_URL + 'profile');
    const response = await axios.put(API_URL + 'profile', formData, config);
    console.log('Auth Service - Response received:', response.status);

    if (response.data) {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('Auth Service - Local storage updated');
    }

    return response.data;
  } catch (error) {
    console.error('Auth Service - Profile update error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });

    if (error.response?.status === 403) {
      throw new Error('Your session has expired. Please log in again.');
    }

    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }

    throw error;
  }
};

const authService = {
  register,
  login,
  logout,
  refreshAccessToken,
  updateProfile,
};

export default authService; 