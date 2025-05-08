import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { browser } from '$app/environment';

// Validate environment variables
const requiredEnvVars = [
  'VITE_PUBLIC_FIREBASE_API_KEY',
  'VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_PUBLIC_FIREBASE_APP_ID',
  'VITE_PUBLIC_VAPID_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'draw-26a0c.firebaseapp.com',
  projectId: 'draw-26a0c',
  storageBucket: 'draw-26a0c.appspot.com',
  messagingSenderId: import.meta.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID,
};

let messaging = null;
if (browser) {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export { messaging };