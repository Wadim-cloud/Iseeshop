-- Migration: Add motion capture columns to collab_strokes
-- These columns enable stroke-level behavioral analysis and replay.

ALTER TABLE collab_strokes
  ADD COLUMN IF NOT EXISTS timestamp    DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS stroke_id    TEXT,
  ADD COLUMN IF NOT EXISTS velocity     DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS acceleration DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS pressure     DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS brush_type   TEXT DEFAULT 'normal';

-- Index for efficient replay: load all strokes for a session ordered by time
CREATE INDEX IF NOT EXISTS idx_collab_strokes_session_timestamp
  ON collab_strokes (session_id, timestamp);

-- Index for grouping points into pen-down → pen-up sequences
CREATE INDEX IF NOT EXISTS idx_collab_strokes_stroke_id
  ON collab_strokes (stroke_id);

-- Index for behavioral analysis queries by brush type
CREATE INDEX IF NOT EXISTS idx_collab_strokes_brush_type
  ON collab_strokes (brush_type);
