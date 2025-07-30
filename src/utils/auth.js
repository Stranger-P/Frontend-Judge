import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const checkAuth = async (dispatch) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/check-auth`, {
      withCredentials: true, // Send the cookie
    });
    if (response.data.success) {
      console.log('Auth check successful:', response.data.user);
      dispatch({ type: 'user/loginSuccess', payload: response.data.user }); // Update Redux
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
};