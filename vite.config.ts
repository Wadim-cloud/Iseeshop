import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
		$components: "/src/components",
		$lib: "/src/lib", // For reusable utilities or helpers
		$stores: "/src/stores", // For Svelte stores
		$assets: "/src/assets", // For images, styles, etc.
	  }	  
  },
});