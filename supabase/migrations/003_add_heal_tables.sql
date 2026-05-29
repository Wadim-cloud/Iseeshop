-- Create2Heal: Session tracking for behavioral monitoring
CREATE TABLE IF NOT EXISTS heal_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  drawing_id TEXT,
  title TEXT DEFAULT 'Healing Session',
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
  flow_score DOUBLE PRECISION DEFAULT 0,
  steadiness_score DOUBLE PRECISION DEFAULT 0,
  brush_type_distribution JSONB DEFAULT '{}'::jsonb,
  velocity_profile JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create2Heal: Stroke-level motion data
CREATE TABLE IF NOT EXISTS heal_strokes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES heal_sessions(id) ON DELETE CASCADE,
  x0 DOUBLE PRECISION NOT NULL,
  y0 DOUBLE PRECISION NOT NULL,
  x1 DOUBLE PRECISION NOT NULL,
  y1 DOUBLE PRECISION NOT NULL,
  color TEXT DEFAULT '#000000',
  width DOUBLE PRECISION DEFAULT 5,
  timestamp DOUBLE PRECISION DEFAULT 0,
  stroke_id TEXT,
  velocity DOUBLE PRECISION DEFAULT 0,
  acceleration DOUBLE PRECISION DEFAULT 0,
  pressure DOUBLE PRECISION DEFAULT 0.5,
  brush_type TEXT DEFAULT 'normal',
  is_hesitation BOOLEAN DEFAULT FALSE,
  is_correction BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_heal_sessions_user ON heal_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_heal_sessions_created ON heal_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_heal_strokes_session ON heal_strokes(session_id);
CREATE INDEX IF NOT EXISTS idx_heal_strokes_timestamp ON heal_strokes(session_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_heal_strokes_hesitation ON heal_strokes(session_id) WHERE is_hesitation = TRUE;
CREATE INDEX IF NOT EXISTS idx_heal_strokes_correction ON heal_strokes(session_id) WHERE is_correction = TRUE;

-- RLS policies
ALTER TABLE heal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE heal_strokes ENABLE ROW LEVEL SECURITY;

-- heal_sessions: users can manage their own sessions
CREATE POLICY "Users can view own heal sessions" ON heal_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own heal sessions" ON heal_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own heal sessions" ON heal_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own heal sessions" ON heal_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- heal_strokes: users can manage strokes in their own sessions
CREATE POLICY "Users can view own heal strokes" ON heal_strokes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM heal_sessions WHERE heal_sessions.id = heal_strokes.session_id AND heal_sessions.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own heal strokes" ON heal_strokes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM heal_sessions WHERE heal_sessions.id = heal_strokes.session_id AND heal_sessions.user_id = auth.uid())
  );
