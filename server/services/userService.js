import axios from 'axios';

const API_URL = '/api/users/'; // User API base URL

// Helper function to get auth header
const authHeader = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all users (Admin only)
const getAllUsers = async (token) => {
  const response = await axios.get(API_URL, authHeader(token));
  return response.data;
};

const userService = {
  getAllUsers,
  // Add other user-related service functions here later if needed (e.g., activate/deactivate user)
};

export default userService; 