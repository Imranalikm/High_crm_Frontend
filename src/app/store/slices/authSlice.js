import { createSlice } from '@reduxjs/toolkit';
import { getPermissionsForRole } from '@/shared/config/permissions/permissions';

const SESSION_KEY = 'lt_session';

const getStoredSession = () => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const initialUser = getStoredSession();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    isAuthenticated: !!initialUser,
    permissions: initialUser?.role ? getPermissionsForRole(initialUser.role) : [],
  },
  reducers: {
    setSession: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.permissions = action.payload?.role ? getPermissionsForRole(action.payload.role) : [];

      try {
        if (action.payload) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(action.payload));
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      } catch (e) {
        console.error(e);
      }
    },
    clearSession: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.permissions = [];
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch (e) {
        console.error(e);
      }
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
