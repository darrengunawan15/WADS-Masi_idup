import axios from 'axios';

const API_URL = '/api/tickets/'; // Adjust if your ticket API base URL is different

// Helper function to get auth header
const authHeader = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Create new ticket
const createTicket = async (ticketData, token) => {
  const response = await axios.post(API_URL, ticketData, authHeader(token));
  return response.data;
};

// Get user tickets (or all tickets for staff/admin, backend handles logic)
const getTickets = async (token) => {
  const response = await axios.get(API_URL, authHeader(token));
  return response.data;
};

// Get single ticket
const getTicket = async (ticketId, token) => {
  const response = await axios.get(API_URL + ticketId, authHeader(token));
  return response.data;
};

// Update ticket (status, assignment, etc.)
const updateTicket = async (ticketId, updateData, token) => {
    const response = await axios.put(API_URL + ticketId, updateData, authHeader(token));
    return response.data;
};

// Assign ticket
const assignTicket = async (ticketId, assignedToUserId, token) => {
    const response = await axios.put(API_URL + ticketId + '/assign', { assignedTo: assignedToUserId }, authHeader(token));
    return response.data;
};

// Add comment to ticket
const addComment = async (ticketId, commentData, token) => {
    const response = await axios.post(API_URL + ticketId + '/comments', commentData, authHeader(token));
    return response.data;
};

// Get comments for a ticket
const getComments = async (ticketId, token) => {
    const response = await axios.get(API_URL + ticketId + '/comments', authHeader(token));
    return response.data;
};

// Upload file to ticket
const uploadFile = async (ticketId, fileData, token) => {
    // fileData should be FormData
    const response = await axios.post(API_URL + ticketId + '/upload', fileData, {
        headers: {
            ...authHeader(token).headers,
            'Content-Type': 'multipart/form-data', // Important for file uploads
        },
    });
    return response.data;
};

const ticketService = {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  assignTicket,
  addComment,
  getComments,
  uploadFile,
};

export default ticketService; 