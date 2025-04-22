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
declare const GalleryItem: $$__sveltets_2_IsomorphicComponent<{
    drawing: {
        id: number;
        image_data: string;
        likes: number;
        created_at: string;
    };
    onLike: () => void;
    onPreview: () => void;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type GalleryItem = InstanceType<typeof GalleryItem>;
export default GalleryItem;
