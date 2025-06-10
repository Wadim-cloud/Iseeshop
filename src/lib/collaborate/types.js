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

export type Stroke = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  width: number;
};

export type Toast = {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
};