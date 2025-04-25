// src/routes/create/+page.server.js
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  return {
    session: locals.session
  };
};