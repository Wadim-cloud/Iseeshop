# Architecture Overview

Pexos is built as a modern web application using the SvelteKit framework with a Supabase backend.

---

## Tech Stack

| Layer        | Technology                                 |
| ------------ | ------------------------------------------ |
| Framework    | **SvelteKit** (Svelte 5)                   |
| Styling      | **Tailwind CSS v4** + **DaisyUI v5**       |
| Backend/DB   | **Supabase** (PostgreSQL, Auth, Realtime, Storage, Edge Functions) |
| 3D Graphics  | **Three.js** + **Threlte** (Svelte wrapper for Three.js) |
| Charts       | **Chart.js**, **D3.js**                    |
| Auth         | Supabase OAuth (Google, GitHub)            |
| Deployment   | **Netlify**, **Vercel**                    |
| Mobile       | **Capacitor** (Android)                    |

## Application Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│  ┌───────────┐  ┌────────────┐  ┌────────────┐ │
│  │ SvelteKit │  │  Three.js   │  │  Supabase  │ │
│  │  Routes   │  │  Scenes     │  │  Client    │ │
│  └─────┬─────┘  └──────┬─────┘  └──────┬─────┘ │
│        │               │               │        │
│  ┌─────┴─────┐  ┌──────┴─────┐  ┌──────┴─────┐ │
│  │   Svelte  │  │   Canvas   │  │  Realtime   │ │
│  │   Stores  │  │   WebGL    │  │  Channels   │ │
│  └───────────┘  └────────────┘  └──────┬─────┘ │
└─────────────────────────────────────────┼───────┘
                                          │
                                          ▼
                              ┌───────────────────┐
                              │     Supabase       │
                              │  ┌──────────────┐  │
                              │  │  PostgreSQL   │  │
                              │  │  (drawings,   │  │
                              │  │   todos,      │  │
                              │  │   sessions)   │  │
                              │  └──────────────┘  │
                              │  ┌──────────────┐  │
                              │  │  Auth (OAuth) │  │
                              │  └──────────────┘  │
                              │  ┌──────────────┐  │
                              │  │  Storage      │  │
                              │  │  (images)     │  │
                              │  └──────────────┘  │
                              │  ┌──────────────┐  │
                              │  │  Edge Funcs   │  │
                              │  └──────────────┘  │
                              └───────────────────┘
```

## Routing

Pexos uses SvelteKit's file-based routing. Each directory under `src/routes/` maps to a URL path:

| Route                | Page                               |
| -------------------- | ---------------------------------- |
| `/`                  | Home — hero section with shader background |
| `/create`            | Drawing canvas for creating art    |
| `/gallery`           | Browse all public drawings         |
| `/gallery/[id]`      | Individual drawing detail page     |
| `/gallery/checkout`  | Shopping cart checkout              |
| `/collaborate`       | Real-time collaborative drawing    |
| `/chat`              | Operator chain generator & 3D visualization |
| `/playground`        | 3D model viewer with STL support   |
| `/cross`             | Drone swarm simulation             |
| `/cross/2` – `/cross/5` | Additional swarm variations    |
| `/shaders-filters`   | Hope poster image filter           |
| `/todo`              | Shared todo list                   |
| `/profile`           | Push notification subscription     |
| `/settings`          | About info & resource pledging     |
| `/settings/admin`    | Admin panel                        |
| `/settings/notifications` | Notification settings         |
| `/about`             | About Pexos page                   |
| `/auth/callback`     | OAuth callback handler             |

## State Management

Pexos uses **Svelte stores** (`writable`, `derived`) for state management:

- **Session store** — tracks the authenticated user session (layout level)
- **Cart store** — manages the shopping cart (`$lib/gallery/stores.ts`)
- **Likes store** — tracks like counts per drawing
- **Comment counts** — caches comment counts for gallery items
- **Notification store** — manages notification state (`$lib/stores/notifications`)

## Rendering

- **SSR** is used for most pages via SvelteKit's default behavior
- **CSR-only** pages (like `/collaborate`) use `export const ssr = false` since they depend heavily on browser APIs (Canvas, WebSocket)
- A **service worker** (`src/routes/service-worker.ts`) handles offline caching

## API Routes

Server-side API endpoints live under `src/routes/api/`:

| Endpoint                      | Purpose                          |
| ----------------------------- | -------------------------------- |
| `/api/submit-order`           | Process checkout orders          |
| `/api/collab/sessions`        | Manage collaboration sessions    |
