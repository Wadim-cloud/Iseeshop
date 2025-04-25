import type { Writable } from 'svelte/store';

export type CanvasContext = Writable<{
  canvas: HTMLCanvasElement | null;
}>;