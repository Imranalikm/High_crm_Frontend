import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  try {
    return localStorage.getItem('app-theme') || 'dark';
  } catch {
    return 'dark';
  }
};

const getInitialColorTheme = () => {
  try {
    return localStorage.getItem('app-color-theme') || 'obsidian';
  } catch {
    return 'obsidian';
  }
};

const getInitialCollapsed = () => {
  try {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  } catch {
    return false;
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: getInitialTheme(),
    colorTheme: getInitialColorTheme(),
    sidebarCollapsed: getInitialCollapsed(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('app-theme', state.theme);
      } catch (e) {
        console.error(e);
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      try {
        localStorage.setItem('app-theme', action.payload);
      } catch (e) {
        console.error(e);
      }
    },
    setColorTheme: (state, action) => {
      state.colorTheme = action.payload;
      try {
        localStorage.setItem('app-color-theme', action.payload);
      } catch (e) {
        console.error(e);
      }
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      try {
        localStorage.setItem('sidebar-collapsed', String(state.sidebarCollapsed));
      } catch (e) {
        console.error(e);
      }
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
      try {
        localStorage.setItem('sidebar-collapsed', String(action.payload));
      } catch (e) {
        console.error(e);
      }
    },
  },
});

export const { toggleTheme, setTheme, setColorTheme, toggleSidebar, setSidebarCollapsed } = themeSlice.actions;
export default themeSlice.reducer;
