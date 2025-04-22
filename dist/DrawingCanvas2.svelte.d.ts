import type { Writable } from 'svelte/store';
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const DrawingCanvas2: $$__sveltets_2_IsomorphicComponent<{
    color: string;
    size: number;
    canvasStore: Writable<{
        canvas: HTMLCanvasElement | null;
    }> | undefined;
    disabled?: boolean;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type DrawingCanvas2 = InstanceType<typeof DrawingCanvas2>;
export default DrawingCanvas2;
