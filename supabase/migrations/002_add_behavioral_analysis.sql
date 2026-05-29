-- Phase 1: Add hesitation and correction columns to collab_strokes
ALTER TABLE collab_strokes ADD COLUMN IF NOT EXISTS is_hesitation BOOLEAN DEFAULT FALSE;
ALTER TABLE collab_strokes ADD COLUMN IF NOT EXISTS is_correction BOOLEAN DEFAULT FALSE;

-- Phase 3: Create motion_baselines table for behavioral drift detection
CREATE TABLE IF NOT EXISTS motion_baselines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_count INTEGER DEFAULT 0,
  avg_velocity DOUBLE PRECISION DEFAULT 0,
  avg_acceleration DOUBLE PRECISION DEFAULT 0,
  avg_pressure DOUBLE PRECISION DEFAULT 0,
  avg_hesitation_rate DOUBLE PRECISION DEFAULT 0,
  avg_correction_rate DOUBLE PRECISION DEFAULT 0,
  avg_stroke_duration DOUBLE PRECISION DEFAULT 0,
  brush_type_distribution JSONB DEFAULT '{}'::jsonb,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create session_metrics table for per-session analytics
CREATE TABLE IF NOT EXISTS session_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_duration DOUBLE PRECISION DEFAULT 0,
  stroke_count INTEGER DEFAULT 0,
  point_count INTEGER DEFAULT 0,
  avg_velocity DOUBLE PRECISION DEFAULT 0,
  max_velocity DOUBLE PRECISION DEFAULT 0,
  avg_pressure DOUBLE PRECISION DEFAULT 0,
  pressure_variance DOUBLE PRECISION DEFAULT 0,
  hesitation_count INTEGER DEFAULT 0,
  correction_count INTEGER DEFAULT 0,
  hesitation_rate DOUBLE PRECISION DEFAULT 0,
  correction_rate DOUBLE PRECISION DEFAULT 0,
  avg_stroke_duration DOUBLE PRECISION DEFAULT 0,
  brush_type_distribution JSONB DEFAULT '{}'::jsonb,
  velocity_profile JSONB DEFAULT '[]'::jsonb,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for behavioral analysis
CREATE INDEX IF NOT EXISTS idx_baselines_user ON motion_baselines(user_id);
CREATE INDEX IF NOT EXISTS idx_session_metrics_user ON session_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_session_metrics_session ON session_metrics(session_id);

-- Index for hesitation/correction queries
CREATE INDEX IF NOT EXISTS idx_strokes_hesitation ON collab_strokes(session_id) WHERE is_hesitation = TRUE;
CREATE INDEX IF NOT EXISTS idx_strokes_correction ON collab_strokes(session_id) WHERE is_correction = TRUE;

-- RLS policies
ALTER TABLE motion_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own baselines" ON motion_baselines
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own baselines" ON motion_baselines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own baselines" ON motion_baselines
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own session metrics" ON session_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own session metrics" ON session_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);
