import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ticketService from '../../services/ticketService'; // Import ticketService

const initialState = {
  tickets: [],
  ticket: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  dailyStats: [], // Add state for daily ticket stats
  isStatsLoading: false, // Add loading state for stats
  isStatsError: false, // Add error state for stats
  statsMessage: '', // Add message for stats errors
  averageResponseTime: [], // Add state for response time
  isResponseTimeLoading: false, // Loading state
  isResponseTimeError: false, // Error state
  responseTimeMessage: '', // Error message
  customerTickets: [], // Add state for customer tickets
  isCustomerTicketsLoading: false,
  isCustomerTicketsError: false,
  customerTicketsMessage: '',
};

// Create new ticket (for customers)
export const createTicket = createAsyncThunk(
  'tickets/create',
  async (ticketData, thunkAPI) => {
    try {
      // Get token from auth state
      const token = thunkAPI.getState().auth.accessToken;
      return await ticketService.createTicket(ticketData, token); // Use ticketService
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user tickets (or all tickets for staff/admin, backend handles logic)
export const getTickets = createAsyncThunk(
  'tickets/getAll',
  async (_, thunkAPI) => {
    try {
      // Get token from auth state
      const token = thunkAPI.getState().auth.accessToken;
      return await ticketService.getTickets(token); // Use ticketService
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single ticket
export const getTicket = createAsyncThunk(
  'tickets/get',
  async (ticketId, thunkAPI) => {
    try {
      // Get token from auth state
      const token = thunkAPI.getState().auth.accessToken;
      return await ticketService.getTicket(ticketId, token); // Use ticketService
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Close ticket (for customers or staff/admin depending on rules)
export const closeTicket = createAsyncThunk(
    'tickets/close',
    async (ticketId, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.accessToken;
         return await ticketService.updateTicket(ticketId, { status: 'closed' }, token); // Use ticketService to update status
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

// Update ticket (status, priority, etc.) - Used by Staff/Admin and potentially Customer to close
export const updateTicket = createAsyncThunk(
    'tickets/update',
    async ({ ticketId, updateData }, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.accessToken;
        return await ticketService.updateTicket(ticketId, updateData, token); // Use ticketService
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

// Add comment to a ticket
export const addComment = createAsyncThunk(
    'tickets/addComment',
    async ({ ticketId, content }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.accessToken;
            return await ticketService.addComment(ticketId, { content }, token);
        } catch (error) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Assign ticket (Staff/Admin)
export const assignTicket = createAsyncThunk(
    'tickets/assign',
    async ({ ticketId, assignedToUserId }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.accessToken;
            return await ticketService.assignTicket(ticketId, assignedToUserId, token);
        } catch (error) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Upload file to ticket
export const uploadFile = createAsyncThunk(
    'tickets/uploadFile',
    async ({ ticketId, fileData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.accessToken;
            return await ticketService.uploadFile(ticketId, fileData, token);
        } catch (error) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get daily ticket statistics
export const fetchDailyTicketStats = createAsyncThunk(
    'tickets/fetchDailyStats',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.accessToken;
            return await ticketService.getDailyTicketStats(token);
        } catch (error) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get average response time statistics
export const fetchAverageResponseTime = createAsyncThunk(
    'tickets/fetchAverageResponseTime',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.accessToken;
            return await ticketService.getAverageResponseTime(token);
        } catch (error) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get tickets for the logged-in customer
export const getCustomerTickets = createAsyncThunk(
  'tickets/getCustomerTickets',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      return await ticketService.getCustomerTickets(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    reset: (state) => initialState, // Reset state to initial state
    resetFlags: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickets.push(action.payload); // Add new ticket to the list
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickets = action.payload; // Set tickets to the fetched data
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ticket = action.payload; // Set single ticket to the fetched data
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.ticket = {};
      })
       .addCase(closeTicket.fulfilled, (state, action) => {
        // Update the status of the closed ticket in the tickets list
        state.tickets = state.tickets.map((ticket) =>
          ticket._id === action.payload._id ? { ...ticket, status: 'closed' } : ticket
        );
        // If the currently viewed single ticket is the one being closed, update its status too
        if (state.ticket._id === action.payload._id) {
             state.ticket.status = 'closed';
        }
       })
       .addCase(updateTicket.fulfilled, (state, action) => {
         // Update the ticket in the tickets list
          state.tickets = state.tickets.map((ticket) =>
              ticket._id === action.payload._id ? action.payload : ticket
          );
          // If the currently viewed single ticket is the one being updated, update it too
          if (state.ticket._id === action.payload._id) {
              state.ticket = action.payload;
          }
       })
       .addCase(addComment.fulfilled, (state, action) => {
           // Add the new comment to the single ticket's comments array if viewing that ticket
           if (state.ticket._id === action.payload.ticket) {
               state.ticket.comments.push(action.payload);
           }
           // Optionally, update comments in the tickets list view if needed (less common)
       })
        .addCase(assignTicket.fulfilled, (state, action) => {
            // Update the assignedTo field for the ticket in the tickets list
            state.tickets = state.tickets.map((ticket) =>
                ticket._id === action.payload._id ? { ...ticket, assignedTo: action.payload.assignedTo } : ticket
            );
            // If the currently viewed single ticket is the one being assigned, update its assignedTo too
            if (state.ticket._id === action.payload._id) {
                 state.ticket.assignedTo = action.payload.assignedTo;
            }
        })
        .addCase(uploadFile.fulfilled, (state, action) => {
             // Add the new file attachment to the single ticket's fileAttachments array if viewing that ticket
             if (state.ticket._id === action.payload.ticket) {
                 if (!state.ticket.fileAttachments) {
                     state.ticket.fileAttachments = [];
                 }
                 state.ticket.fileAttachments.push(action.payload);
             }
             // Optionally, update file attachments in the tickets list view if needed (less common)
        })
        // Reducers for fetching daily ticket stats
        .addCase(fetchDailyTicketStats.pending, (state) => {
          state.isStatsLoading = true;
          state.isStatsError = false;
          state.statsMessage = '';
        })
        .addCase(fetchDailyTicketStats.fulfilled, (state, action) => {
          state.isStatsLoading = false;
          state.dailyStats = action.payload;
        })
        .addCase(fetchDailyTicketStats.rejected, (state, action) => {
          state.isStatsLoading = false;
          state.isStatsError = true;
          state.statsMessage = action.payload;
        })
        // Reducers for fetching average response time
        .addCase(fetchAverageResponseTime.pending, (state) => {
          state.isResponseTimeLoading = true;
          state.isResponseTimeError = false;
          state.responseTimeMessage = '';
        })
        .addCase(fetchAverageResponseTime.fulfilled, (state, action) => {
          state.isResponseTimeLoading = false;
          state.averageResponseTime = action.payload;
        })
        .addCase(fetchAverageResponseTime.rejected, (state, action) => {
          state.isResponseTimeLoading = false;
          state.isResponseTimeError = true;
          state.responseTimeMessage = action.payload;
        })
        .addCase(getCustomerTickets.pending, (state) => {
          state.isCustomerTicketsLoading = true;
          state.isCustomerTicketsError = false;
          state.customerTicketsMessage = '';
        })
        .addCase(getCustomerTickets.fulfilled, (state, action) => {
          state.isCustomerTicketsLoading = false;
          state.customerTickets = action.payload;
        })
        .addCase(getCustomerTickets.rejected, (state, action) => {
          state.isCustomerTicketsLoading = false;
          state.isCustomerTicketsError = true;
          state.customerTicketsMessage = action.payload;
        });

  },
});

export const { reset, resetFlags } = ticketSlice.actions;

// Export all async thunks and other necessary actions individually
export { };

export default ticketSlice.reducer; 