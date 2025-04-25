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
declare const GalleryView: $$__sveltets_2_IsomorphicComponent<{
    drawing: Drawing;
    onLike: (id: string) => void;
    onPreview: (imageData: string) => void;
    on3DPreview: (imageData: string) => void;
    onOpenComments: (drawingId: string, drawingUuid: string) => void;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type GalleryView = InstanceType<typeof GalleryView>;
export default GalleryView;
