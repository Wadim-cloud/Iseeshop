import type { Stroke, SessionMetrics, MotionBaseline, DriftReport } from './types.js';

export function computeSessionMetrics(sessionId: string, strokes: Stroke[]): SessionMetrics {
  if (strokes.length === 0) {
    return {
      session_id: sessionId,
      total_duration: 0,
      stroke_count: 0,
      point_count: 0,
      avg_velocity: 0,
      max_velocity: 0,
      avg_pressure: 0,
      pressure_variance: 0,
      hesitation_count: 0,
      correction_count: 0,
      hesitation_rate: 0,
      correction_rate: 0,
      avg_stroke_duration: 0,
      brush_type_distribution: {},
      velocity_profile: [],
    };
  }

  const timestamps = strokes.map(s => s.timestamp);
  const minTs = Math.min(...timestamps);
  const maxTs = Math.max(...timestamps);
  const total_duration = maxTs - minTs;
  const durationMinutes = total_duration / 60000;

  const velocities = strokes.map(s => s.velocity).filter(v => v > 0);
  const pressures = strokes.map(s => s.pressure);
  const avg_velocity = velocities.length > 0 ? velocities.reduce((a, b) => a + b, 0) / velocities.length : 0;
  const max_velocity = velocities.length > 0 ? Math.max(...velocities) : 0;
  const avg_pressure = pressures.reduce((a, b) => a + b, 0) / pressures.length;
  const pressure_variance = pressures.length > 0
    ? pressures.reduce((sum, p) => sum + Math.pow(p - avg_pressure, 2), 0) / pressures.length
    : 0;

  const hesitation_count = strokes.filter(s => s.is_hesitation).length;
  const correction_count = strokes.filter(s => s.is_correction).length;

  const strokeIds = new Set(strokes.map(s => s.stroke_id));
  const stroke_count = strokeIds.size;

  // Compute avg stroke duration
  const strokeDurations: number[] = [];
  for (const id of strokeIds) {
    const strokePoints = strokes.filter(s => s.stroke_id === id);
    if (strokePoints.length > 1) {
      const sts = strokePoints.map(s => s.timestamp);
      strokeDurations.push(Math.max(...sts) - Math.min(...sts));
    }
  }
  const avg_stroke_duration = strokeDurations.length > 0
    ? strokeDurations.reduce((a, b) => a + b, 0) / strokeDurations.length
    : 0;

  // Brush type distribution
  const brush_type_distribution: Record<string, number> = {};
  for (const s of strokes) {
    brush_type_distribution[s.brush_type] = (brush_type_distribution[s.brush_type] || 0) + 1;
  }

  // Velocity profile (1-second windows)
  const windowSize = 1000;
  const velocity_profile: number[] = [];
  if (total_duration > 0) {
    for (let t = minTs; t < maxTs; t += windowSize) {
      const windowStrokes = strokes.filter(s => s.timestamp >= t && s.timestamp < t + windowSize);
      const windowVelocities = windowStrokes.map(s => s.velocity).filter(v => v > 0);
      velocity_profile.push(
        windowVelocities.length > 0
          ? windowVelocities.reduce((a, b) => a + b, 0) / windowVelocities.length
          : 0
      );
    }
  }

  return {
    session_id: sessionId,
    total_duration,
    stroke_count,
    point_count: strokes.length,
    avg_velocity,
    max_velocity,
    avg_pressure,
    pressure_variance,
    hesitation_count,
    correction_count,
    hesitation_rate: durationMinutes > 0 ? hesitation_count / durationMinutes : 0,
    correction_rate: durationMinutes > 0 ? correction_count / durationMinutes : 0,
    avg_stroke_duration,
    brush_type_distribution,
    velocity_profile,
  };
}

export function computeBaseline(allSessions: SessionMetrics[]): MotionBaseline {
  if (allSessions.length === 0) {
    return {
      user_id: '',
      session_count: 0,
      avg_velocity: 0,
      avg_acceleration: 0,
      avg_pressure: 0,
      avg_hesitation_rate: 0,
      avg_correction_rate: 0,
      avg_stroke_duration: 0,
      brush_type_distribution: {},
      computed_at: new Date().toISOString(),
    };
  }

  const n = allSessions.length;
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  // Merge brush type distributions
  const merged: Record<string, number> = {};
  for (const s of allSessions) {
    for (const [key, count] of Object.entries(s.brush_type_distribution)) {
      merged[key] = (merged[key] || 0) + count;
    }
  }
  const totalBrush = Object.values(merged).reduce((a, b) => a + b, 0);
  const brush_type_distribution: Record<string, number> = {};
  for (const [key, count] of Object.entries(merged)) {
    brush_type_distribution[key] = totalBrush > 0 ? count / totalBrush : 0;
  }

  return {
    user_id: '',
    session_count: n,
    avg_velocity: avg(allSessions.map(s => s.avg_velocity)),
    avg_acceleration: 0,
    avg_pressure: avg(allSessions.map(s => s.avg_pressure)),
    avg_hesitation_rate: avg(allSessions.map(s => s.hesitation_rate)),
    avg_correction_rate: avg(allSessions.map(s => s.correction_rate)),
    avg_stroke_duration: avg(allSessions.map(s => s.avg_stroke_duration)),
    brush_type_distribution,
    computed_at: new Date().toISOString(),
  };
}

export function detectDrift(current: SessionMetrics, baseline: MotionBaseline, allSessions: SessionMetrics[]): DriftReport[] {
  if (allSessions.length < 2) return [];

  const reports: DriftReport[] = [];

  const metrics: { name: string; current: number; values: number[] }[] = [
    { name: 'Velocity', current: current.avg_velocity, values: allSessions.map(s => s.avg_velocity) },
    { name: 'Pressure', current: current.avg_pressure, values: allSessions.map(s => s.avg_pressure) },
    { name: 'Hesitation Rate', current: current.hesitation_rate, values: allSessions.map(s => s.hesitation_rate) },
    { name: 'Correction Rate', current: current.correction_rate, values: allSessions.map(s => s.correction_rate) },
    { name: 'Stroke Duration', current: current.avg_stroke_duration, values: allSessions.map(s => s.avg_stroke_duration) },
  ];

  for (const m of metrics) {
    const mean = m.values.reduce((a, b) => a + b, 0) / m.values.length;
    const stddev = Math.sqrt(m.values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / m.values.length);

    if (stddev === 0) continue;

    const deviation = Math.abs(m.current - mean) / stddev;

    if (deviation > 1.5) {
      reports.push({
        metric: m.name,
        current: m.current,
        baseline: mean,
        deviation,
        severity: deviation > 3 ? 'high' : deviation > 2 ? 'medium' : 'low',
      });
    }
  }

  return reports;
}
