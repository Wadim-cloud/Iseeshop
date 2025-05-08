import { createClient } from "@supabase/supabase-js";
import "./client.js";
const SUPABASE_URL = "";
const SUPABASE_API_KEY = "";
{
  throw new Error("Missing Supabase configuration");
}
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    storage: void 0,
    storageKey: "sb-auth-token"
  }
});
export {
  supabase as s
};
