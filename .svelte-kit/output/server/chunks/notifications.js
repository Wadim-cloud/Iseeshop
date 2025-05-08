import { w as writable } from "./exports.js";
import "./supabase.js";
import "firebase/app";
import "firebase/messaging";
const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": true };
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
