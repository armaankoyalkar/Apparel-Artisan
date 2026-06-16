import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('jwtToken');
const userInfo = localStorage.getItem('userInfo');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    user: userInfo ? JSON.parse(userInfo) : null,
    isAuthenticated: !!token,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('jwtToken', action.payload.token);
      localStorage.setItem('userInfo', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;