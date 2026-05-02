# Contributing

Thank you for your interest in contributing to Pexos! Here's how to get started.

---

## Setup

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Iseeshop.git
   cd Iseeshop
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables (see [Getting Started](Getting-Started.md))
5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style

- **Framework:** SvelteKit with Svelte 5 (uses `$props`, `$state`, runes where applicable)
- **Language:** TypeScript (`.ts` and `lang="ts"` in Svelte components)
- **Styling:** Tailwind CSS v4 + DaisyUI v5, plus component-scoped `<style>` blocks
- **Formatting:** Follow the existing code style in each file

### Component Structure

Pexos organizes components in two main locations:

- **`src/lib/`** — Shared, reusable components and utilities
- **`src/routes/`** — Page-specific components co-located with their routes

When creating new components:

1. Check if a similar component already exists
2. Place shared components in `src/lib/`
3. Place page-specific components alongside their route
4. Use TypeScript for type safety
5. Add component-scoped styles in `<style>` blocks

### Adding a New Page

1. Create a new directory under `src/routes/`
2. Add a `+page.svelte` file
3. If the page needs server data, add `+page.server.ts`
4. Update the features list in `src/lib/FeaturesModal.svelte`
5. Add navigation to `src/lib/NavBar.svelte` if appropriate

### Working with Supabase

- Use the shared client from `$lib/supabase`
- For server-side operations, use `$lib/supabase/server.ts`
- Follow existing patterns for queries, subscriptions, and error handling
- Never expose service role keys or other secrets in client-side code

### 3D Components

- Use **Three.js** directly or **Threlte** (Svelte Three.js wrapper)
- STL models go in `static/models/`
- Textures go in `static/texture/`

## Type Checking

Before submitting a PR, run the type checker:

```bash
npm run check
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm run check` to verify types
4. Test your changes locally with `npm run dev`
5. Submit a pull request with a clear description of your changes

## Project Links

- **Live site:** [pexos.netlify.app](https://pexos.netlify.app)
- **Repository:** [github.com/Wadim-cloud/Iseeshop](https://github.com/Wadim-cloud/Iseeshop)
- **Support:** [buymeacoffee.com/wadiem](https://buymeacoffee.com/wadiem)
