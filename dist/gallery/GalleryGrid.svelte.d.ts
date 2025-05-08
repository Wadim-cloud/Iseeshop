import type { Drawing } from './GalleryContainer.svelte';
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
declare const GalleryGrid: $$__sveltets_2_IsomorphicComponent<{
    drawings: Drawing[];
    loading: boolean;
    error: string | null;
    onLike: (id: string) => void;
    onPreview: (img: string) => void;
    onOpenComments: (drawingId: string, drawingUuid: string) => void;
    onPageChange: (page: number) => void;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type GalleryGrid = InstanceType<typeof GalleryGrid>;
export default GalleryGrid;
