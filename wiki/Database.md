# Database & Supabase

Pexos uses **Supabase** as its backend, providing PostgreSQL database, authentication, real-time subscriptions, file storage, and edge functions.

---

## Supabase Project

The Supabase project is hosted at:

```
https://paapzvsnrzsuhtowmihz.supabase.co
```

## Database Tables

### `drawings`

Stores all user-created drawings.

| Column      | Type      | Description                           |
| ----------- | --------- | ------------------------------------- |
| `id`        | UUID      | Primary key                           |
| `drawing_id`| TEXT      | Human-readable ID (`username-N-title`)|
| `image_data`| TEXT      | Base64 data or Storage path           |
| `title`     | TEXT      | Drawing title                         |
| `likes`     | INTEGER   | Like count                            |
| `user_id`   | UUID      | Creator's user ID (nullable)          |
| `user_email`| TEXT      | Creator's email                       |
| `blocked`   | BOOLEAN   | Whether the drawing is hidden         |
| `created_at`| TIMESTAMP | Creation timestamp                    |
| `comments`  | JSONB     | Legacy comments field (nullable)      |

### `todos`

User todo items.

| Column       | Type    | Description             |
| ------------ | ------- | ----------------------- |
| `id`         | INTEGER | Primary key             |
| `description`| TEXT    | Todo text               |
| `done`       | BOOLEAN | Completion status       |
| `user_id`    | UUID    | Owner's user ID         |

### `shared_todos`

Links todos shared between users.

| Column              | Type    | Description               |
| ------------------- | ------- | ------------------------- |
| `id`                | INTEGER | Primary key               |
| `todo_id`           | INTEGER | Reference to `todos.id`   |
| `shared_with_user_id` | UUID | Recipient user ID         |

### `collaborators`

User registry for sharing features.

| Column  | Type | Description          |
| ------- | ---- | -------------------- |
| `id`    | UUID | User ID              |
| `email` | TEXT | User email (unique)  |

### `notifications`

Push notification records.

| Column      | Type      | Description               |
| ----------- | --------- | ------------------------- |
| `id`        | INTEGER   | Primary key               |
| `user_id`   | UUID      | Target user               |
| `message`   | TEXT      | Notification message      |
| `drawing_id`| TEXT      | Related drawing (nullable)|
| `sent`      | BOOLEAN   | Whether it has been sent  |
| `created_at`| TIMESTAMP | Creation timestamp        |

### `resource_pledges`

User computing resource pledges.

| Column       | Type    | Description                 |
| ------------ | ------- | --------------------------- |
| `user_id`    | UUID    | Pledging user               |
| `cpu`        | BOOLEAN | CPU pledged                 |
| `gpu`        | BOOLEAN | GPU pledged                 |
| `maxCpu`     | TEXT    | Max CPU usage percentage    |
| `maxGpu`     | TEXT    | Max GPU usage percentage    |
| `maxHours`   | TEXT    | Daily max hours             |
| `idleOnly`   | BOOLEAN | Only when machine is idle   |
| `customHours`| BOOLEAN | Custom schedule enabled     |
| `fromHour`   | TEXT    | Schedule start time         |
| `toHour`     | TEXT    | Schedule end time           |
| `days`       | TEXT[]  | Active days of the week     |

### `canvases`

Stores collaborative canvas data.

| Column      | Type      | Description               |
| ----------- | --------- | ------------------------- |
| `canvas_id` | TEXT      | Unique canvas identifier  |
| `title`     | TEXT      | Canvas title              |
| `image_data`| TEXT      | Saved canvas image        |
| `updated_at`| TIMESTAMP | Last update timestamp     |

## Database Functions (RPC)

| Function              | Purpose                                      |
| --------------------- | -------------------------------------------- |
| `get_comment_counts`  | Returns comment counts for a list of drawing IDs |
| `get_shared_todos`    | Returns todos shared with a specific user    |

## Supabase Storage

Drawings can be stored in the `drawings` bucket. Image paths starting with `drawings/` are resolved using signed URLs:

```typescript
const { data } = await supabase.storage
  .from('drawings')
  .createSignedUrl(drawing.image_data, 3600); // 1 hour expiry
```

## Supabase Edge Functions

| Function           | Purpose                                   |
| ------------------ | ----------------------------------------- |
| `list-sessions`    | List collaboration sessions for a user    |
| `smart-endpoint`   | Generate Gotify push notification tokens  |

## Realtime Subscriptions

Pexos uses Supabase Realtime for live updates:

- **Todo changes** — `postgres_changes` on the `todos` table
- **Shared todo changes** — `postgres_changes` on `shared_todos`
- **Collaboration strokes** — custom Realtime channels for broadcasting drawing strokes

### Subscription Helper

```typescript
import { subscribeToTable } from '$lib/supabase';

const unsubscribe = subscribeToTable('drawings', (payload) => {
  console.log('Drawing changed:', payload);
});

// Later: unsubscribe();
```

## Client Configuration

The Supabase client is configured in `src/lib/supabase.ts`:

```typescript
export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: browser ? localStorage : undefined,
    storageKey: 'sb-auth-token'
  }
});
```

A separate SSR client exists at `src/lib/supabase/server.ts` for server-side operations.
