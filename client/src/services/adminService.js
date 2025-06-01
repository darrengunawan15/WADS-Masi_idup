import axios from 'axios';

const USERS_URL = '/api/users/';
const TICKETS_URL = '/api/tickets/';

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Get all users (admin only)
const getAllUsers = async (token) => {
  const response = await axios.get(USERS_URL, authHeader(token));
  return response.data;
};

// Get all staff users
const getStaff = async (token) => {
  const response = await axios.get(USERS_URL + '?role=staff', authHeader(token));
  return response.data;
};

// Update user (admin only)
const updateUser = async (userId, updateData, token) => {
  const response = await axios.put(USERS_URL + userId, updateData, authHeader(token));
  return response.data;
};

// Get all tickets
const getAllTickets = async (token) => {
  const response = await axios.get(TICKETS_URL, authHeader(token));
  return response.data;
};

// Get unassigned tickets
const getUnassignedTickets = async (token) => {
  const response = await axios.get(TICKETS_URL + '?status=unassigned', authHeader(token));
  return response.data;
};

// Assign ticket to staff
const assignTicket = async (ticketId, assignedToUserId, token) => {
  const response = await axios.put(TICKETS_URL + ticketId + '/assign', { assignedTo: assignedToUserId }, authHeader(token));
  return response.data;
};

const adminService = {
  getAllUsers,
  getStaff,
  updateUser,
  getAllTickets,
  getUnassignedTickets,
  assignTicket,
};

export default adminService; 