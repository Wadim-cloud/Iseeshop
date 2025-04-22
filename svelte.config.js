import adapter from '@sveltejs/adapter-netlify';

const config = {
  kit: {
    adapter: adapter(),
    // other configurations if needed
  }
};

export default config;
