import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [], // List of all users (for admin to manage)
    loading: false,
    error: null,
  },
  reducers: {
    fetchUsersStart: (state) => { state.loading = true; state.error = null; },
    fetchUsersSuccess: (state, action) => { state.loading = false; state.users = action.payload; state.error = null; },
    fetchUsersFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    updateRoleStart: (state) => { state.loading = true; state.error = null; },
    updateRoleSuccess: (state, action) => { state.loading = false; const { userId, role } = action.payload; const user = state.users.find(u => u.id === userId); if (user) user.role = role; state.error = null; },
    updateRoleFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    deleteUserStart: (state) => { state.loading = true; state.error = null; },
    deleteUserSuccess: (state, action) => { state.loading = false; state.users = state.users.filter(u => u.id !== action.payload); state.error = null; },
    deleteUserFailure: (state, action) => { state.loading = false; state.error = action.payload; },
  },
});

export const { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure, updateRoleStart, updateRoleSuccess, updateRoleFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure } = adminSlice.actions;
export default adminSlice.reducer;