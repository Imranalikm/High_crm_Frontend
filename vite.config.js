import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@/shared': path.resolve(__dirname, 'src/shared'),
      '@/admin': path.resolve(__dirname, 'src/admin'),
      '@/client': path.resolve(__dirname, 'src/client'),
      '@/components': path.resolve(__dirname, 'src/shared/components'),
      '@/hooks': path.resolve(__dirname, 'src/shared/hooks'),
      '@/utils': path.resolve(__dirname, 'src/shared/utils'),
      '@/styles': path.resolve(__dirname, 'src/shared/styles'),
      '@/api': path.resolve(__dirname, 'src/shared/api'),
      '@/auth': path.resolve(__dirname, 'src/shared/features/auth'),
      '@/config': path.resolve(__dirname, 'src/shared/config'),
      // Feature aliases fallback
      '@/features/auth': path.resolve(__dirname, 'src/shared/features/auth'),
      '@/features/account-center': path.resolve(__dirname, 'src/shared/features/account-center'),
      '@/features/client-dashboard': path.resolve(__dirname, 'src/client/features/client-dashboard'),
      '@/features/client-finance': path.resolve(__dirname, 'src/client/features/client-finance'),
      '@/features/client-support': path.resolve(__dirname, 'src/client/features/client-support'),
      '@/features/dashboard': path.resolve(__dirname, 'src/admin/features/dashboard'),
      '@/features/users': path.resolve(__dirname, 'src/admin/features/users'),
      '@/features/finance': path.resolve(__dirname, 'src/admin/features/finance'),
      '@/features/trading': path.resolve(__dirname, 'src/admin/features/trading'),
      '@/features/copy-trading': path.resolve(__dirname, 'src/admin/features/copy-trading'),
      '@/features/ib-system': path.resolve(__dirname, 'src/admin/features/ib-system'),
      '@/features/prop-trading': path.resolve(__dirname, 'src/admin/features/prop-trading'),
      '@/features/reports': path.resolve(__dirname, 'src/admin/features/reports'),
      '@/features/support': path.resolve(__dirname, 'src/admin/features/support'),
      '@/features/settings': path.resolve(__dirname, 'src/admin/features/settings'),
      '@/features/roles-permissions': path.resolve(__dirname, 'src/admin/features/roles-permissions'),
      '@/features/group-management': path.resolve(__dirname, 'src/admin/features/group-management'),
      // Base alias at the end to prevent greedy matching
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: '/liveTrader-admin/',
});
