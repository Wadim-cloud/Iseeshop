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
declare const Floating3DModel: $$__sveltets_2_IsomorphicComponent<{
    stlFile?: string;
    defaultTextureImage?: string;
    width?: string;
    height?: string;
    backgroundColor?: number;
    modelColor?: number;
    floating?: boolean;
    rotationSpeedY?: number;
    autoRotate?: boolean;
    enableZoom?: boolean;
    initialZoom?: number;
    drawingData?: string | null;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type Floating3DModel = InstanceType<typeof Floating3DModel>;
export default Floating3DModel;
