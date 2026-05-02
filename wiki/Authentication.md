# Authentication

Pexos uses **Supabase Auth** with OAuth providers for user authentication.

---

## Supported Providers

| Provider   | Description                          |
| ---------- | ------------------------------------ |
| **Google** | Sign in with Google account          |
| **GitHub** | Sign in with GitHub account          |

## Auth Flow

1. User clicks "Sign In" on the home page or navbar
2. The **AuthModal** opens with two provider options (Google / GitHub)
3. Each provider button triggers an interactive block grid animation
4. Clicking a block initiates Supabase OAuth with PKCE flow
5. User is redirected to the provider's consent screen
6. After approval, the callback redirects to `/auth/callback`
7. The session is established and persisted in localStorage

### OAuth Configuration

```typescript
supabase.auth.signInWithOAuth({
  provider,  // 'google' | 'github'
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    queryParams: { access_type: 'offline', prompt: 'consent' }
  }
});
```

## Session Management

### Client-Side

- Sessions are persisted in `localStorage` under the key `sb-auth-token`
- Auto-refresh is enabled — tokens are refreshed before expiry
- Session detection in URL is enabled (for OAuth callbacks)

### Layout-Level Session

The root layout (`+layout.svelte`) initializes the session:

1. Calls `supabase.auth.getSession()` on mount
2. Listens for `onAuthStateChange` events
3. Redirects to `/` on sign-out
4. Passes session to `NavBar` and child routes

### Server-Side

- `hooks.server.ts` handles server-side session validation
- SSR Supabase client (`$lib/supabase/server.ts`) supports cookie-based auth
- In development mode, cookies are set manually for `sb-access-token` and `sb-refresh-token`

## Auth-Protected Features

The following features require authentication:

- Creating drawings (`/create`)
- Liking drawings
- Posting comments
- Accessing the todo list
- Using the collaboration feature
- Subscribing to push notifications
- Resource pledging

Unauthenticated users are prompted with the auth modal when trying to access protected features.

## AuthModal Component

**File:** `src/lib/Authmodal.svelte`

The auth modal features a unique **interactive block grid UI**:

- A 10x5 grid of blocks with hover and click animations
- Blue highlights follow the cursor
- Red flashes appear on hovered blocks
- Clicking a block turns it black and triggers the OAuth login
- Separate grid instances for Google and GitHub buttons

## User Data

Authenticated users have the following metadata available:

| Field              | Source                                |
| ------------------ | ------------------------------------- |
| `email`            | OAuth provider                        |
| `full_name`        | `user_metadata.full_name`             |
| `avatar_url`       | `user_metadata.avatar_url`            |
| `id`               | Supabase user UUID                    |

## Helper Functions

Located in `src/lib/supabase.ts`:

| Function              | Purpose                              |
| --------------------- | ------------------------------------ |
| `getCurrentUser()`    | Get the current authenticated user   |
| `signInWithProvider()` | Initiate OAuth with a provider      |
| `signOut()`           | Sign the user out                    |
| `getUserProfile()`    | Fetch a user's profile from the `profiles` table |
