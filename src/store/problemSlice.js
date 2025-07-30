import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// The base URL is already configured in the axios instance,
// so we only need relative paths for the requests.
const api = axios.create({
  baseURL: '',
  withCredentials: true,
});

// Corrected thunk to post to a more logical endpoint for creating problems.
export const createProblem = createAsyncThunk(
  'problem/createProblem',
  async (problemData, { rejectWithValue }) => {
    try {
      // NOTE: Changed the URL from '/auth/signup' to '/problems'
      // The `problemData` is expected to be a FormData object.
      const { data } = await axios.post(`${BASE_URL}/api/problems`, problemData, {
        headers: { 'Content-Type': 'multipart/form-data'},
        withCredentials: true,
      });
      console.log(data);
      return data;
    } catch (error) {
      console.error('Create problem API error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create problem');
    }
  }
);

const initialState = {
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  created: 'hello',
};

const problemSlice = createSlice({
  name: 'problem',
  initialState,
  reducers: {
    // Action to reset the state, useful for clearing status after a form submission.
    resetProblemState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.created = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProblem.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.created = null;
      })
      .addCase(createProblem.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
        state.created = true; // Indicating that a problem was successfully created
      })
      .addCase(createProblem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.created = false; // Indicating that problem creation failed
      });
  },
});

export const { resetProblemState } = problemSlice.actions;
export default problemSlice.reducer;