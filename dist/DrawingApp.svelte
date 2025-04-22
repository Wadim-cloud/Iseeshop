<script lang="ts">
    import { afterUpdate, onMount } from 'svelte';
    import supabase, { getCurrentUser } from './supabase';
    import DrawingCanvas from './DrawingCanvas2.svelte';
    import DrawingControls from './DrawingControls.svelte';
    import DrawingMenu from './DrawingMenu.svelte';
    import CanvasShader from './CanvasShader.svelte';
    import Toast from './Toast.svelte';
    import type { Session } from '@supabase/supabase-js';

    // Props
    export let session: Session | null = null;

    // Constants
    const COLORS = ["red", "green", "blue", "black", "white"] as const;
    const INITIAL_COLOR = "black";
    const INITIAL_SIZE = 10;
    const TOAST_DURATION = 3000;

    // Reactive State
    let color = INITIAL_COLOR;
    let size = INITIAL_SIZE;
    let showMenu = false;
    let selected = INITIAL_COLOR;
    let toastState = {
        message: '',
        visible: false,
        type: 'success' as const
    };
    let toastTimeout: NodeJS.Timeout;
    let user = null;

    // Initialize user
    onMount(async () => {
        user = await getCurrentUser();
    });

    // Session Debugging
    afterUpdate(() => {
        if (import.meta.env.DEV && session) {
            console.debug('[DrawingApp] Session active for:', session.user?.email);
        }
    });

    // Core Drawing Functions
    const saveDrawing = async (canvas: HTMLCanvasElement) => {
        if (!validateSavePrerequisites(canvas)) return;
        
        try {
            await verifyRateLimits();
            await persistDrawing(canvas);
            notifySuccess('Drawing saved successfully!');
        } catch (error) {
            handlePersistError(error);
        }
    };

    // Validation Helpers
    const validateSavePrerequisites = (canvas: HTMLCanvasElement | null): canvas is HTMLCanvasElement => {
        if (!canvas) {
            notifyError('No canvas element found');
            return false;
        }
        if (!session?.user) {
            notifyError('Please login to save drawings');
            return false;
        }
        return true;
    };

    // API Interactions
    const verifyRateLimits = async () => {
        try {
            const response = await fetch('/.netlify/functions-internal/check-rate-limit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: session?.user.id })
            });

            if (!response.ok) throw new Error('Rate limit service unavailable');

            const result = await response.json();
            if (result.blocked || result.limited) {
                throw new Error(result.message || "Submission limit reached");
            }
        } catch (error) {
            console.error('[Rate Limit]', error);
            throw error;
        }
    };

    const persistDrawing = async (canvas: HTMLCanvasElement) => {
        try {
            const imageData = canvas.toDataURL("image/png");
            const { error } = await supabase.from("drawings").insert({
                image_data: imageData,
                user_id: session?.user.id,
                user_email: session?.user.email,
                created_at: new Date().toISOString()
            });
            if (error) throw error;
        } catch (error) {
            console.error('[Supabase] Persist error:', error);
            throw error;
        }
    };

    // Error Handling
    const handlePersistError = (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Failed to save drawing';
        console.error('[DrawingApp] Save error:', error);
        notifyError(message);
    };

    // UI Helpers
    const notifySuccess = (message: string) => showToast(message, 'success');
    const notifyError = (message: string) => showToast(message, 'error');

    const showToast = (message: string, type: 'success' | 'error') => {
        clearTimeout(toastTimeout);
        toastState = { message, visible: true, type };
        toastTimeout = setTimeout(() => {
            toastState.visible = false;
        }, TOAST_DURATION);
    };

    // User Interactions
    const updateColor = (newColor: string) => {
        selected = color = newColor;
    };

    const updateSize = (newSize: number) => {
        size = Math.max(1, Math.min(50, newSize)); // Clamp between 1-50
    };

    const toggleMenu = () => {
        showMenu = !showMenu;
    };
</script>

{#if session}
    <DrawingCanvas {color} {size} />
    
    <DrawingControls 
        onSave={saveDrawing}
        onMenuToggle={toggleMenu}
    />
    
    {#if showMenu}
        <DrawingMenu 
            colors={COLORS}
            selected={selected}
            size={size}
            onColorChange={updateColor}
            onSizeChange={updateSize}
        />
    {/if}
{:else}
    <CanvasShader message="You need to log in to start creating">
        <DrawingCanvas {color} {size} disabled />
    </CanvasShader>
{/if}

<Toast 
    message={toastState.message} 
    show={toastState.visible} 
    type={toastState.type} 
/>

<style>
    /* Preserve existing styles */
</style>