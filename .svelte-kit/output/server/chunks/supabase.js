import { createClient } from "@supabase/supabase-js";
import "./client.js";
const SUPABASE_URL = "https://paapzvsnrzsuhtowmihz.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYXB6dnNucnpzdWh0b3dtaWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNjM0ODMsImV4cCI6MjA0ODgzOTQ4M30.pOozDGMkZ3dZUwTUh35fvny5bfE16QVWlC146dZgUI0";
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
