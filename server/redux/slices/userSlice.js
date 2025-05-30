import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService'; // We will create this service next

const initialState = {
  users: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get all users (Admin only)
export const getAllUsers = createAsyncThunk(
  'users/getAll', // Action type prefix
  async (_, thunkAPI) => {
    try {
      // Get token from auth state (assuming admin is logged in)
      const token = thunkAPI.getState().auth.accessToken;
      // Call the userService function to fetch users
      return await userService.getAllUsers(token);
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

export const userSlice = createSlice({
  name: 'user', // Slice name
  initialState,
  reducers: {
    reset: (state) => initialState, // Reset state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload; // Set the users array with fetched data
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.users = []; // Clear users on error
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer; 