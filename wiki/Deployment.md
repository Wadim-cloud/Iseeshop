# Deployment

Pexos is deployed to multiple platforms for redundancy and flexibility.

---

## Netlify

**Primary deployment:** [pexos.netlify.app](https://pexos.netlify.app)

### Configuration

The `netlify.toml` file configures the Netlify build:

```toml
[build]
  command = "npm run build"
  publish = "build"
```

The SvelteKit Netlify adapter (`@sveltejs/adapter-netlify`) handles SSR and serverless functions.

### Redirects

A `static/_redirects` file handles custom URL redirects.

## Vercel

**Secondary deployment:** [pexos.vercel.app](https://pexos.vercel.app)

### Configuration

The `vercel.json` file configures the Vercel deployment. The SvelteKit Vercel adapter (`@sveltejs/adapter-vercel`) is also installed.

## Environment Variables

Both Netlify and Vercel require the following environment variables:

| Variable                       | Description                    |
| ------------------------------ | ------------------------------ |
| `VITE_PUBLIC_SUPABASE_URL`     | Supabase project URL           |
| `VITE_PUBLIC_SUPABASE_API_KEY` | Supabase anon/public key       |
| `VITE_SUPABASE_URL`            | Supabase URL (for checkout)    |
| `VITE_SUPABASE_ANON_KEY`       | Supabase anon key (for checkout)|

## Mobile (Android)

Pexos includes a **Capacitor** configuration (`capacitor.config.ts`) for building an Android app:

```typescript
// capacitor.config.ts
const config = {
  appId: 'com.pexos.app',
  appName: 'Pexos',
  webDir: 'build'
};
```

The `android/` directory contains the native Android project. To build:

```bash
npx cap sync
npx cap open android
```

## Build Commands

| Command           | Purpose                          |
| ----------------- | -------------------------------- |
| `npm run build`   | Build the production app         |
| `npm run preview` | Preview the production build     |
| `npm run package` | Build the library for publishing |

## Service Worker

Pexos includes a service worker (`src/routes/service-worker.ts`) that provides:

- Offline caching of static assets
- Background sync capabilities
- Progressive Web App (PWA) support

## Analytics

Google Tag Manager is integrated via `GTM-TVHZWJGB` for tracking user interactions and page views.
