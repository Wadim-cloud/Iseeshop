import { w as writable } from "./exports.js";
import { s as supabase } from "./supabase.js";
const user = writable(null);
supabase.auth.getSession().then(({ data: { session } }) => {
  user.set(session?.user ?? null);
});
supabase.auth.onAuthStateChange((event, session) => {
  user.set(session?.user ?? null);
});
export {
  user as u
};
