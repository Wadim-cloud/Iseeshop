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
declare const DPreviewModal: $$__sveltets_2_IsomorphicComponent<{
    drawings: Drawing[];
    onLike: (id: number) => void;
    onPreview: (imageData: string) => void;
    on3DPreview: (imageData: string) => void;
    loading?: boolean;
    error?: string | null;
    selectedDrawing?: string | null;
    selected3DDrawing?: string | null;
    onClosePreview?: () => void;
    onClose3DPreview?: () => void;
}, {
    click: MouseEvent;
} & {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type DPreviewModal = InstanceType<typeof DPreviewModal>;
export default DPreviewModal;
