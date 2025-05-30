import axios from 'axios';

const API_URL = '/api/users/'; // Adjust if your user API base URL is different

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

const authService = {
  register,
  login,
  logout,
  refreshAccessToken,
};

export default authService; 