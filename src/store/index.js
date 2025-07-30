import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import problemReducer from './problemSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    problem: problemReducer,
  },
});

export default store;