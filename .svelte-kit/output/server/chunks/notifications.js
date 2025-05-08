import { w as writable } from "./exports.js";
import "./supabase.js";
import "firebase/app";
import "firebase/messaging";
const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": true, "VITE_PUBLIC_FIREBASE_API_KEY": "AIzaSyAAfD9sA_JRIR7aMmc9Dpd0Vtnff-7JJ28", "VITE_PUBLIC_FIREBASE_APP_ID": "1:501065720855:web:b28637c7cf2a4f92be2852", "VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "501065720855", "VITE_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYXB6dnNucnpzdWh0b3dtaWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNjM0ODMsImV4cCI6MjA0ODgzOTQ4M30.pOozDGMkZ3dZUwTUh35fvny5bfE16QVWlC146dZgUI0", "VITE_PUBLIC_SUPABASE_API_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYXB6dnNucnpzdWh0b3dtaWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNjM0ODMsImV4cCI6MjA0ODgzOTQ4M30.pOozDGMkZ3dZUwTUh35fvny5bfE16QVWlC146dZgUI0", "VITE_PUBLIC_SUPABASE_URL": "https://paapzvsnrzsuhtowmihz.supabase.co", "VITE_PUBLIC_VAPID_KEY": "BELklaUjBuMlZTLleQ8YIbcs0FrMIccru9Usr5LG2ly7unLOknEOw0LvOg4TSN0DKH77TdCOVEdXb3paVlN8Gic", "VITE_SUPABASE_JWT_SECRET": "HkLLvIxzi2MZg6NgEyHRly+y1hG/k/UGaLXj5ErviJjXp0Mni++l5JTRNitxpuivWztP8RIlFgIzZ/w5Xue+nQ==" };
const requiredEnvVars = [
  "VITE_PUBLIC_FIREBASE_API_KEY",
  "VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_PUBLIC_FIREBASE_APP_ID",
  "VITE_PUBLIC_VAPID_KEY"
];
for (const envVar of requiredEnvVars) {
  if (!__vite_import_meta_env__[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
}
const initialState = {
  notifications: {
    new_user: false,
    comment: false,
    order: false,
    drawing: false
  },
  role: null,
  loading: false,
  error: null,
  success: null,
  toast: { message: "", type: "success", show: false },
  unreadCount: 0
};
const notificationStore = writable(initialState);
const subscriptions = /* @__PURE__ */ new Map();
function cleanupSubscriptions() {
  subscriptions.forEach((unsubscribe) => {
    try {
      unsubscribe();
    } catch (err) {
      console.error("cleanupSubscriptions: Error:", err);
    }
  });
  subscriptions.clear();
}
export {
  cleanupSubscriptions as c,
  notificationStore as n
};
