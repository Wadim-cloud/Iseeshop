<script lang="ts">
    import Floating3DModel from '$lib/Floating3DModel.svelte';
    import { onMount, createEventDispatcher } from 'svelte';
    
    export let imageData: string | null = null;
    
    const dispatch = createEventDispatcher();
    
    let modalElement: HTMLDivElement;
    
    // Close modal when clicking outside content
    function handleBackdropClick(event: MouseEvent) {
        if (event.target === modalElement) {
            close();
        }
    }
    
    // Close on escape key
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            close();
        }
    }
    
    function close() {
        dispatch('close');
    }
    
    // Configure the 3D model
    const modelConfig = {
        stlFile: '/models/tshirt.stl',
        defaultTextureImage: imageData || '/texture/boom.png',
        width: '100%',
        height: '400px',
        backgroundColor: '#f0f0f0',
        modelColor: '#cccccc',
        floating: true,
        rotationSpeedY: 0.5,
        autoRotate: true,
        enableZoom: true,
        initialZoom: 8,
        drawingData: imageData // This passes the gallery image to texture the model
    };
    
    onMount(() => {
        // Prevent page scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        // Focus the modal for keyboard navigation
        modalElement?.focus();
        
        return () => {
            document.body.style.overflow = '';
        };
    });
</script>

<svelte:window on:keydown={handleKeydown} />

<div 
    class="modal-backdrop" 
    bind:this={modalElement} 
    on:click={handleBackdropClick}
    tabindex="-1"
>
    <div class="modal-content">
        <button class="close-button" on:click={close} aria-label="Close preview">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        
        <div class="model-container">
            <h2>3D Preview</h2>
            {#if imageData}
                <Floating3DModel {...modelConfig} />
                <p class="tip">Tip: Use mouse wheel to zoom, click and drag to rotate</p>
            {:else}
                <p class="error">Image data not available for preview</p>
            {/if}
        </div>
    </div>
</div>

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 20px;
    }
    
    .modal-content {
        background-color: white;
        border-radius: 8px;
        width: 100%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    
    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        border: none;
        background: none;
        cursor: pointer;
        z-index: 10;
        padding: 8px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
    }
    
    .close-button:hover {
        background-color: rgba(255, 255, 255, 1);
        transform: scale(1.1);
    }
    
    .model-container {
        padding: 20px;
    }
    
    h2 {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 1.5rem;
        text-align: center;
    }
    
    .tip {
        margin-top: 20px;
        text-align: center;
        font-size: 0.9rem;
        color: #666;
    }
    
    .error {
        text-align: center;
        color: #e74c3c;
        padding: 40px 0;
    }
</style>