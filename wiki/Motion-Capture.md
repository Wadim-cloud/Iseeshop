# Motion Capture

The collaborate feature captures rich motion data with every stroke, enabling replay, behavioral analysis, and style recognition.

---

## Overview

Every drawing interaction in `/collaborate` records not just where you drew, but **how you drew** — speed, acceleration, pressure, timing, and tool identity. This transforms each stroke from a static line into a temporal, behavioral signal.

## Enriched Stroke Data

Each stroke segment carries:

| Field          | Type   | Description                                    |
| -------------- | ------ | ---------------------------------------------- |
| `x0`, `y0`     | number | Start coordinates                              |
| `x1`, `y1`     | number | End coordinates                                |
| `color`        | string | Brush color                                    |
| `width`        | number | Brush size (px)                                |
| `timestamp`    | number | Milliseconds since session start               |
| `stroke_id`    | string | Groups points into pen-down → pen-up sequences |
| `velocity`     | number | Drawing speed (px/ms)                          |
| `acceleration` | number | Rate of speed change (px/ms²)                  |
| `pressure`     | number | Pen/touch pressure (0.0–1.0)                   |
| `brush_type`   | string | `'normal'`, `'twirl'`, or `'horizontal'`       |

## How It Works

### PointerEvent API

The canvas uses the [PointerEvent API](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) instead of separate MouseEvent and TouchEvent handlers. This provides:

- **Unified input** — mouse, touch, and stylus handled by one API
- **Pressure sensitivity** — `e.pressure` returns 0.0–1.0 on supported devices (pen tablets, stylus)
- **Pointer capture** — `setPointerCapture()` ensures strokes aren't lost when the pointer leaves the canvas

### Motion Computation

On every `pointermove` event during drawing:

```
velocity = distance / dt        (px/ms)
acceleration = (v - v_prev) / dt  (px/ms²)
```

Where:
- `distance` = Euclidean distance from the previous point
- `dt` = time delta from the previous point (ms)
- `v_prev` = velocity at the previous point

### Stroke Grouping

A unique `stroke_id` is generated on `pointerdown` and attached to every point until `pointerup`. This groups related points into complete drawing gestures.

```
stroke_id = `${Date.now()}-${random_suffix}`
```

### Timestamps

Timestamps are relative to the session start time (`Date.now() - sessionStartTime`), making them suitable for replay regardless of when the session was created.

## Brush Types

The collaborate feature supports three brush types, selectable from the Settings tab:

| Type         | Description                        |
| ------------ | ---------------------------------- |
| `normal`     | Standard round brush               |
| `twirl`      | Swirl effect (from `/create`)      |
| `horizontal` | Horizontal line effect             |

Brush type acts as a **behavioral modifier** — the same artist produces different motion patterns with different tools, enabling per-tool style profiles.

## Data Flow

```
PointerEvent (browser)
    │
    ▼
DrawingCanvas.svelte
    │  Computes: velocity, acceleration, pressure
    │  Assigns: timestamp, stroke_id, brush_type
    │
    ├──▶ dispatch('stroke', enrichedStroke)
    │         │
    │         ▼
    │    +page.svelte
    │         │
    │         ▼
    │    ChannelManager.sendStroke()
    │         │
    │         ├──▶ POST /save-stroke  (Supabase Edge Function)
    │         │         │
    │         │         ▼
    │         │    collab_strokes table (PostgreSQL)
    │         │
    │         └──▶ Supabase Realtime broadcast
    │                   │
    │                   ▼
    │              Remote users receive stroke
    │
    └──▶ Local canvas rendering (ctx.lineTo)
```

## Supabase Schema

The `collab_strokes` table includes motion capture columns:

```sql
ALTER TABLE collab_strokes
  ADD COLUMN IF NOT EXISTS timestamp    DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS stroke_id    TEXT,
  ADD COLUMN IF NOT EXISTS velocity     DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS acceleration DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS pressure     DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS brush_type   TEXT DEFAULT 'normal';
```

### Indexes

```sql
-- Efficient replay: load strokes ordered by time
CREATE INDEX idx_collab_strokes_session_timestamp
  ON collab_strokes (session_id, timestamp);

-- Group pen-down → pen-up sequences
CREATE INDEX idx_collab_strokes_stroke_id
  ON collab_strokes (stroke_id);

-- Filter by tool type for behavioral analysis
CREATE INDEX idx_collab_strokes_brush_type
  ON collab_strokes (brush_type);
```

The migration file is at `supabase/migrations/001_add_motion_capture_columns.sql`.

## Components

| File | Role |
| ---- | ---- |
| `src/lib/collaborate/types.js` | `Stroke` and `BrushType` type definitions |
| `src/lib/collaborate/DrawingCanvas.svelte` | Captures motion data from PointerEvents |
| `src/lib/collaborate/ControlsPanel.svelte` | Brush type selector UI |
| `src/lib/collaborate/ChannelManager.svelte` | Sends enriched strokes to Supabase |
| `src/routes/collaborate/+page.svelte` | Wires state between components |

## What This Enables (Future)

This motion capture layer is the foundation for the [Future Vision](Future-Vision.md):

- **Replay Engine** — re-animate drawings as time-based performances
- **Behavioral Analysis** — detect mood shifts and motor pattern changes from velocity/acceleration/pressure curves
- **Style Profiles** — build per-tool behavioral baselines for each artist
- **Lattice Construction** — map relationships between strokes using temporal and spatial proximity
- **Generation** — produce new strokes in a user's style based on learned motion patterns

## Pressure Support

| Device | Pressure Behavior |
| ------ | ----------------- |
| Mouse | Always 0.5 (default) |
| Trackpad | Usually 0.5 |
| Stylus / Pen tablet | 0.0–1.0 (continuous) |
| Touch screen | 0.0–1.0 (varies by device) |

Pressure data is most useful with a stylus or pen tablet. On mouse input, it defaults to 0.5 but is still recorded for consistency.
