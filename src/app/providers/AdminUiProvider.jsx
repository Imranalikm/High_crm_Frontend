/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme, setColorTheme, setSidebarCollapsed } from '../store/slices/themeSlice';

const AdminUiContext = createContext(null);

export function AdminUiProvider({ children }) {
  const dispatch = useDispatch();
  
  // Read from Redux
  const theme = useSelector((state) => state.theme.theme);
  const colorTheme = useSelector((state) => state.theme.colorTheme);
  const collapsed = useSelector((state) => state.theme.sidebarCollapsed);
  
  // Local responsive visual state
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  // Tracks whether the sidebar is temporarily expanded by hover
  const [sidebarHovered, setSidebarHovered] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (colorTheme) {
      root.setAttribute('data-theme', colorTheme);
    } else {
      root.removeAttribute('data-theme');
    }
  }, [colorTheme]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        dispatch(setSidebarCollapsed(true));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // The sidebar is visually expanded when: not collapsed OR (collapsed but hovered on desktop)
  const sidebarExpanded = !collapsed || (!isMobile && sidebarHovered);
  const effectiveSidebarWidth = isMobile ? 0 : (sidebarExpanded ? 248 : 68);

  const value = useMemo(() => ({
    collapsed,
    setCollapsed: (val) => dispatch(setSidebarCollapsed(val)),
    theme,
    setTheme: (val) => dispatch(setTheme(val)),
    toggleTheme: () => dispatch(toggleTheme()),
    colorTheme,
    setColorTheme: (val) => dispatch(setColorTheme(val)),
    isMobile,
    sidebarHovered,
    setSidebarHovered,
    sidebarExpanded,
    effectiveSidebarWidth,
  }), [collapsed, theme, colorTheme, isMobile, sidebarHovered, sidebarExpanded, effectiveSidebarWidth, dispatch]);

  return (
    <AdminUiContext.Provider value={value}>
      {children}
    </AdminUiContext.Provider>
  );
}

export function useAdminUi() {
  const context = useContext(AdminUiContext);
  if (!context) {
    throw new Error('useAdminUi must be used within AdminUiProvider');
  }
  return context;
}
