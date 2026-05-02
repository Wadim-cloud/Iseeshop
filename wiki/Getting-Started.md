# Getting Started

This guide walks you through setting up Pexos locally for development.

---

## Prerequisites

- **Node.js** (v18+)
- **npm** (comes with Node.js)
- A **Supabase** project (for the backend — see [Database & Supabase](Database.md))

## Clone & Install

```bash
git clone https://github.com/Wadim-cloud/Iseeshop.git
cd Iseeshop
npm install
```

## Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
VITE_PUBLIC_SUPABASE_API_KEY=your-anon-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> Without access to the Supabase environment, some features (auth, gallery, todos, etc.) will not work. Visit [pexos.netlify.app](https://pexos.netlify.app) to try the live version.

## Development Server

```bash
npm run dev
```

Opens the app at `http://localhost:5173` by default.

To automatically open the browser:

```bash
npm run dev -- --open
```

## Type Checking

```bash
npm run check
```

Or in watch mode:

```bash
npm run check:watch
```

## Building

Build the library:

```bash
npm run package
```

Build the production app:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
Iseeshop/
├── src/
│   ├── lib/              # Shared library code & components
│   │   ├── collaborate/  # Real-time collaboration components
│   │   ├── components/   # Base UI components
│   │   ├── gallery/      # Gallery feature components & stores
│   │   ├── models/       # 3D model components
│   │   ├── stores/       # Global Svelte stores
│   │   ├── supabase/     # Supabase client (SSR)
│   │   ├── ui/           # UI component library
│   │   ├── utils/        # Utility functions
│   │   ├── supabase.ts   # Main Supabase client
│   │   ├── types.ts      # Shared TypeScript types
│   │   └── *.svelte      # Shared Svelte components
│   ├── routes/           # SvelteKit routes (pages)
│   │   ├── about/        # About page
│   │   ├── api/          # API endpoints
│   │   ├── auth/         # Auth callback
│   │   ├── chat/         # Chat / Operator Chains
│   │   ├── collaborate/  # Real-time collaboration
│   │   ├── create/       # Drawing canvas
│   │   ├── cross/        # Drone swarm visualizations
│   │   ├── gallery/      # Gallery & checkout
│   │   ├── playground/   # 3D model playground
│   │   ├── profile/      # User profile & notifications
│   │   ├── sales/        # Sales dashboard
│   │   ├── settings/     # Settings & admin panel
│   │   ├── shaders-filters/ # Hope poster filter
│   │   ├── test/         # Test page
│   │   └── todo/         # Todo list feature
│   ├── app.html          # HTML template
│   └── app.d.ts          # App-level type declarations
├── static/               # Static assets (logos, models, textures)
├── wiki/                 # This wiki
├── package.json
├── svelte.config.js
├── vite.config.ts
└── tsconfig.json
```

## Next Steps

- Read the [Architecture Overview](Architecture.md) to understand how the app is structured
- Explore the [Features](Features.md) documentation
- Check out [Contributing](Contributing.md) for guidelines on making changes
