import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import alias from '@rollup/plugin-alias';
import babel from 'rollup-plugin-babel';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    alias({
      entries: [{ find: '@', replacement: '/src/' }],
    }),
    babel({
      exclude: 'node_modules/**', // 仅仅转译我们的源码
    }),
  ],
});
