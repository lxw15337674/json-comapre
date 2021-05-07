import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import alias from '@rollup/plugin-alias';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    alias({
      entries: [{ find: '@', replacement: '/src/' }],
    }),
  ],
  build: {
    outDir: 'build',
  },
});
