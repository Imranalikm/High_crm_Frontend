import React from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { store } from './store';
import { queryClient } from './query/queryClient';
import { appRouter } from './routes/router';
import { AuthProvider } from '@/shared/features/auth/AuthProvider';
import { AdminSessionProvider } from './providers/AdminSessionProvider';
import { AdminUiProvider } from './providers/AdminUiProvider';
import { UniversalDrawerProvider } from '@/shared/components/overlays';
import { PlatformSettingsProvider } from '@/shared/features/settings/PlatformSettingsContext';

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PlatformSettingsProvider>
            <AdminSessionProvider>
              <AdminUiProvider>
                <UniversalDrawerProvider>
                  <RouterProvider router={appRouter} />
                </UniversalDrawerProvider>
              </AdminUiProvider>
            </AdminSessionProvider>
          </PlatformSettingsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
