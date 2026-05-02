# Features

Pexos offers a rich set of creative and collaborative features. This page documents each one in detail.

---

## Drawing Canvas (Create)

**Route:** `/create`

The core of Pexos — a full-featured drawing application where users can create digital art.

### Capabilities

- **Brush types:** Normal, Twirl, Horizontal
- **Color palette:** Black, Red, Blue, Green (and custom)
- **Brush size:** Adjustable slider
- **Line opacity:** Configurable transparency
- **Background patterns:** Blank or other patterns
- **Title input:** Name your drawing before saving
- **Save to gallery:** Drawings are saved to Supabase with metadata (user, title, timestamp)
- **Gallery modal:** Quick-view recent drawings without leaving the create page

### Components

| Component           | File                                    | Purpose                          |
| ------------------- | --------------------------------------- | -------------------------------- |
| `App.svelte`        | `src/routes/create/App.svelte`          | Main create page orchestrator    |
| `Canvas.svelte`     | `src/routes/create/Canvas.svelte`       | Drawing canvas element           |
| `Toolbar.svelte`    | `src/routes/create/Toolbar.svelte`      | Brush controls & color picker    |
| `SettingsPanel`     | `src/routes/create/SettingsPanel.svelte` | Drawing settings sidebar         |
| `DrawingTitleInput` | `src/routes/create/DrawingTitleInput.svelte` | Title input for the drawing |
| `GalleryModal`      | `src/routes/create/GalleryModal.svelte` | In-page gallery preview          |
| `Toast`             | `src/routes/create/Toast.svelte`        | Notification toasts              |

### Drawing ID Format

Each drawing gets a unique ID: `{username}-{sequenceNumber}-{sanitized-title}`

Example: `wadim-5-sunset-landscape`

---

## Gallery

**Route:** `/gallery`

Browse, like, comment on, and purchase community-created drawings.

### Features

- **Paginated grid** displaying all public (non-blocked) drawings
- **Like system** — click to like a drawing
- **Comment system** — view and post comments on drawings via a modal
- **Shopping cart** — add drawings to your cart for checkout
- **3D T-shirt preview** — preview a drawing on a 3D t-shirt model
- **Drawing detail page** (`/gallery/[id]`) — full-page view of a specific drawing

### Gallery Components

| Component              | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `GalleryContainer`     | Main gallery page orchestrator          |
| `GalleryGrid`          | Grid layout for drawing cards           |
| `GalleryControls`      | Pagination and filter controls          |
| `GalleryItem`          | Individual drawing card                 |
| `PreviewModal`         | Full-size drawing preview               |
| `_3dPreviewModal`      | 3D t-shirt preview with the drawing     |
| `TshirtPreviewModal`   | T-shirt mockup preview                  |
| `CommentsModal`        | Comment thread for a drawing            |
| `ShoppingCart`         | Floating cart widget                    |

### Image Storage

- Drawings are stored either as base64 data or as references to Supabase Storage
- Storage paths starting with `drawings/` are resolved using Supabase signed URLs (valid for 1 hour)

---

## Shopping Cart & Checkout

**Route:** `/gallery/checkout`

Users can add drawings to a cart and order them printed on physical products.

### Available Products

| Product     | Price  |
| ----------- | ------ |
| Coffee Mug  | $19.99 |
| T-Shirt     | $24.99 |
| Poster      | $14.99 |
| Phone Case  | $29.99 |
| Throw Pillow| $34.99 |

### Checkout Flow

1. Browse the gallery and add drawings to the cart
2. Select a 3D object (product) for each drawing
3. Fill in shipping information (name, email, address)
4. Submit the order

### Supported Countries

- **US** (USD, ZIP code validation, state selection)
- **NL** (EUR, Dutch postal code format)
- **UK** (GBP, UK postcode format)
- **DE** (EUR, German postal code format)

Default country: **Netherlands (NL)**

---

## Real-Time Collaboration

**Route:** `/collaborate`

Draw together in real time with other Pexos users using Supabase Realtime channels.

### How It Works

1. **Create or join a session** — each session has a unique ID
2. **Share a link** — the session URL can be shared with others
3. **Draw collaboratively** — brush strokes are broadcast in real time to all connected users
4. **Save the canvas** — the resulting artwork can be saved to the database

### Features

- Brush color and size controls
- Online user list showing who's in the session
- Canvas save/load functionality
- Session management (create, join, list)
- Toast notifications for session events
- Debug info panel

### Technical Details

- Uses **Supabase Realtime** channels for live stroke broadcasting
- Canvas operations happen on a `<canvas>` element with 2D context
- Supabase Edge Functions handle session listing
- Client-side rendering only (`ssr = false`)

---

## Chat & Operator Chains

**Route:** `/chat`

An experimental mathematical visualization tool that generates random operator chains and renders them in 3D.

### Concept

Starting from a number (default: 2), the system applies random operations to reach a target number (default: 18):

| Operator | Operation  |
| -------- | ---------- |
| 1        | `val + 2`  |
| 2        | `val - 2`  |
| 3        | `val * 2`  |
| 4        | `val / 2` (even numbers only) |

### Visualization

- Generates up to **60,000** random chains
- Renders paths as 3D lines using **Three.js**
- Color-coded by chain characteristics:
  - **Red** — chains that reach the target in 18 steps or fewer
  - **Blue** — chains that reach the target in under 100 steps
  - **Green** — longer chains that still reach the target
  - **Yellow** — chains of exactly 50 steps
- Special "heart" chains (exactly 18 steps to reach 18) trigger audio tones
- Audio synthesis maps each operator to a musical note (A4, B4, C5, D5)

---

## 3D Playground

**Route:** `/playground`

A 3D model viewer that loads and displays STL files with interactive controls.

### Default Models

1. **Model 1** — `Dobbelsteen.stl` (dice)
2. **Model 2** — `test.stl`
3. **Model 3** — `tshirt.stl`

### Controls

- **Orbit** — left-click drag to rotate the camera
- **Pan** — right-click drag to move the view
- **Zoom** — mouse wheel to zoom in/out
- **Color** — change model colors
- **Texture** — apply textures to models
- **Visibility** — toggle model visibility

### Technical Details

- Built with **Three.js** and the `STLLoader`
- Custom orbit controls implementation
- UV mapping generated automatically for untextured models
- Shadow support enabled

---

## Shaders & Filters

**Route:** `/shaders-filters`

Apply the "Hope" poster effect to uploaded images — inspired by the iconic Obama "Hope" poster style.

### How to Use

1. Upload an image
2. The Hope filter is automatically applied
3. View the posterized result

### Component

The filter logic lives in `src/lib/Hope.svelte`.

---

## Cross (Drone Swarm Visualization)

**Route:** `/cross`, `/cross/2`, `/cross/3`, `/cross/4`, `/cross/5`

An interactive 3D drone swarm simulation using Three.js.

### Features

- **140 drones** forming dynamic patterns
- **Mouse interaction** — drones evade the cursor with predictive avoidance
- **Golden ratio** positioning using PHI and the silver ratio (delta_s)
- **Adjustable parameters:**
  - Transposition factor (`k`)
  - Wave amplitude
- **Heatmap tracking** — cursor position is smoothly tracked for forecast-based avoidance
- Multiple variations across sub-routes (`/cross/2` through `/cross/5`)

---

## Todo Lists

**Route:** `/todo`

A full-featured shared todo list powered by Supabase.

### Features

- Create, toggle, and delete todos
- **Share todos** with other users via email
- **Real-time sync** — changes are broadcast via Supabase Realtime (`postgres_changes`)
- Shared todos display the email of the person who shared them

### Data Model

- `todos` table — user's own todos
- `shared_todos` table — todos shared between users
- `collaborators` table — user lookup for sharing

---

## Push Notifications

**Route:** `/profile`

Subscribe to push notifications via **Gotify** to receive alerts about drawing activity.

### How It Works

1. Navigate to your profile
2. Click "Subscribe to Gotify"
3. A Supabase Edge Function generates a Gotify token
4. Paste the token in your Gotify client app to start receiving notifications

---

## Settings & Resource Pledging

**Route:** `/settings`

### About Section

Displays information about Pexos and its creators, along with a link to support the team on Buy Me a Coffee.

### Resource Pledging

Users can pledge their computing resources (CPU/GPU) to help the Pexos platform:

- Select CPU and/or GPU
- Set maximum usage percentages
- Configure daily runtime limits
- Choose idle-only mode
- Set custom availability hours and days

Pledges are stored in the `resource_pledges` Supabase table and trigger an email notification to the Pexos team.

---

## Admin Panel

**Route:** `/settings/admin`

An administrative interface for managing the platform (details restricted to authorized users like `savebertin`).

---

## Home Page

**Route:** `/`

The landing page features:

- **WebGL shader background** via `CanvasShader.svelte`
- **Cinematic entrance animation** — elements appear with staggered fly/fade transitions
- **Auth-aware greeting** — shows user email when logged in
- **Features modal** — quick navigation to all platform features
- **Comments modal** — view and post home page comments (authenticated users)
