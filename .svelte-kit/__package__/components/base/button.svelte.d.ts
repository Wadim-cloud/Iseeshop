import type { HTMLButtonAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
type Variant = 'default' | 'inverted' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
type Props = HTMLButtonAttributes & {
    children?: Snippet;
    class?: string;
    disabled?: boolean;
    edge?: 'default' | 'circle' | 'sharp';
    loading?: boolean;
    size?: 'default' | 'icon' | 'small' | 'fit';
    variant?: Variant;
};
declare const Button: import("svelte").Component<Props, {}, "loading">;
type Button = ReturnType<typeof Button>;
export default Button;
