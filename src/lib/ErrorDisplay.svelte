<!-- src/lib/ErrorDisplay.svelte -->
<script lang="ts">
    export let title: string;
    export let message: string;
    export let actions: Array<{
        label: string;
        action: () => void;
        variant?: 'primary' | 'secondary';
    }> = [];
</script>

<div class="error-container">
    <h2>{title}</h2>
    <p class="error-message">{message}</p>
    
    <div class="actions">
        {#each actions as action}
            <button
                on:click={action.action}
                class:primary={action.variant === 'primary' || !action.variant}
                class:secondary={action.variant === 'secondary'}
            >
                {action.label}
            </button>
        {/each}
    </div>
</div>

<style>
    .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        padding: 2rem;
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
    }
    
    h2 {
        color: #d32f2f;
        margin-bottom: 1rem;
    }
    
    .error-message {
        color: #5f6368;
        margin-bottom: 2rem;
        line-height: 1.5;
    }
    
    .actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    button {
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
    }
    
    .primary {
        background: #4285f4;
        color: white;
        border: none;
    }
    
    .secondary {
        background: transparent;
        border: 1px solid #dadce0;
        color: #3c4043;
    }
    
    @media (max-width: 600px) {
        .actions {
            flex-direction: column;
            width: 100%;
        }
        
        button {
            width: 100%;
        }
    }
</style>