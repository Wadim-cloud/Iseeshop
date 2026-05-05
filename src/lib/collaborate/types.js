// src/lib/collaborate/types.js
export type UserData = {
  user_id: string;
  email: string;
};

export type Session = {
  session_id: string;
  title: string;
  canvas_id: string | null;
  created_at: string;
  creator_id: string;
  active: boolean;
};

export type Canvas = {
  canvas_id: string;
  title: string;
  creator_id: string;
  updated_at: string | null;
};

export type BrushType = 'normal' | 'twirl' | 'horizontal';

export type Stroke = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  width: number;
  timestamp: number;
  stroke_id: string;
  velocity: number;
  acceleration: number;
  pressure: number;
  brush_type: BrushType;
  is_hesitation: boolean;
  is_correction: boolean;
  user_id?: string;
};

export type SessionMetrics = {
  session_id: string;
  total_duration: number;
  stroke_count: number;
  point_count: number;
  avg_velocity: number;
  max_velocity: number;
  avg_pressure: number;
  pressure_variance: number;
  hesitation_count: number;
  correction_count: number;
  hesitation_rate: number;
  correction_rate: number;
  avg_stroke_duration: number;
  brush_type_distribution: Record<string, number>;
  velocity_profile: number[];
};

export type MotionBaseline = {
  user_id: string;
  session_count: number;
  avg_velocity: number;
  avg_acceleration: number;
  avg_pressure: number;
  avg_hesitation_rate: number;
  avg_correction_rate: number;
  avg_stroke_duration: number;
  brush_type_distribution: Record<string, number>;
  computed_at: string;
};

export type DriftReport = {
  metric: string;
  current: number;
  baseline: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high';
};

export type Toast = {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
};