// @ts-nocheck
// src/routes/create/+page.server.js
import type { PageServerLoad } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  return {
    session: locals.session
  };
};