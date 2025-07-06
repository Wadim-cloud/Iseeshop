import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $components: '/src/components',
      $lib: '/src/lib',
      $stores: '/src/stores',
      $assets: '/src/assets',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['node_modules', 'src']
      },
    },
  },
});
