import adapter from '@sveltejs/adapter-netlify';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
  kit: {
    adapter: adapter(),
    alias: {
      $components: path.resolve(__dirname, 'src/components'),
      $lib: path.resolve(__dirname, 'src/lib'),
      $styles: path.resolve(__dirname, 'src/styles'),
    },
  }
};

export default config;
