import type { Session } from '@supabase/supabase-js';
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
declare const NavBar: $$__sveltets_2_IsomorphicComponent<{
    session: Session | null;
    onAuthToggle: () => void;
}, {
    click: MouseEvent;
} & {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type NavBar = InstanceType<typeof NavBar>;
export default NavBar;
