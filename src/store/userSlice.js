import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const loginUser = createAsyncThunk('authentication/loginUser', async (credentialsObject) => {
  try {
    const { data } = await api.post(`${BASE_URL}/api/auth/login`, credentialsObject, { withCredentials: true });
    return data;                              
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
});

export const SignUp = createAsyncThunk('authentication/SignUp', async (registrationPayload) => {
  try {
    const { data } = await api.post(`${BASE_URL}/api/auth/signup`, registrationPayload, { withCredentials: true });
    return data;
  } catch (error) {
    console.error('Register API error:', error);
    throw error;
  }
});

export const getProfile = createAsyncThunk('authentication/getProfile', async () => {
  try {
    const { data } = await api.get(
      `${BASE_URL}/api/auth/profile`,          
      { withCredentials: true }
    );
    console.log(data);
    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
});

export const logoutUser = createAsyncThunk('authentication/logoutUser', async () => {
  try {
    const { data } = await api.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
    return data;
  } catch (error) {
    console.error('Logout API error:', error);
    throw error;
  }
})
export const googleLogin = createAsyncThunk('auth/google', async () => {
  window.location.href = `${BASE_URL}/auth/google`;
});

const initialState = {
  isAuthenticated: false,
  user: null,
  status: 'idle',
  message: '',
  error: null
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.status = 'loading'; state.error = null; state.message = '';
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.isAuthenticated = action.payload.success;
      state.user = action.payload.user || null;
      state.message = action.payload.message;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error?.message || 'Login failed';
      state.isAuthenticated = false; state.user = null; state.message = '';
    });

    builder.addCase(SignUp.pending, (state) => {
      state.status = 'loading'; state.error = null; state.message = '';
    });
    builder.addCase(SignUp.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.isAuthenticated = action.payload.success;
      state.user = action.payload.user || null;
      state.message = action.payload.message;
    });
    builder.addCase(SignUp.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error?.message || 'SignUp failed';
      state.isAuthenticated = false; state.user = null; state.message = '';
    });

    builder.addCase(logoutUser.pending, (state) => {
      state.status = 'loading'; state.error = null; state.message = '';
    });
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.isAuthenticated = false;  
      state.user = null;
      state.message = action.payload.message;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error?.message || 'Logout failed';
      state.isAuthenticated = false; state.user = null; state.message = '';
    });

    builder.addCase(getProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.user || null;
    });
    builder.addCase(getProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message || 'Profile fetch failed';
        state.isAuthenticated = false;
        state.user = null;
    });
    builder.addCase(googleLogin.pending,  (state) => { state.status = 'loading'; });
    builder.addCase(googleLogin.fulfilled,(state) => { state.status = 'redirecting'; });
  }
});

export default authenticationSlice.reducer;