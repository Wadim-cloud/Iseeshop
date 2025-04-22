<!-- src/lib/DrawingMenu.svelte -->
<script lang="ts">
    export let colors: string[];
    export let selected: string;
    export let size: number;
    export let onColorChange: (color: string) => void;
    export let onSizeChange: (size: number) => void;

    let showAdvanced = false;
</script>

<div class="menu">
    <div class="section">
        <h3 class="section-title">Colors</h3>
        <div class="color-grid">
            {#each colors as color}
                <button
                    class="color-button"
                    class:selected={selected === color}
                    style="background-color: {color}"
                    on:click={() => onColorChange(color)}
                    aria-label={color}
                />
            {/each}
        </div>
    </div>

    <div class="section">
        <h3 class="section-title">Brush Size</h3>
        <div class="slider-container">
            <input
                type="range"
                min="1"
                max="50"
                bind:value={size}
                on:input={() => onSizeChange(size)}
                style="--thumb-color: {selected}"
                class="size-slider"
            />
            <span class="size-value" style="color: {selected}">{size}px</span>
        </div>
    </div>

    <div class="section">
        <button class="advanced-toggle" on:click={() => (showAdvanced = !showAdvanced)}>
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
        </button>

        {#if showAdvanced}
            <div class="advanced-options">
                <label class="option">
                    <input type="checkbox" />
                    Pressure Sensitivity
                </label>
                <label class="option">
                    <input type="checkbox" checked />
                    Smooth Strokes
                </label>
            </div>
        {/if}
    </div>
</div>

<style>
    .menu {
        position: fixed;
        top: 5rem;
        left: 1rem;
        background: white;
        border-radius: 12px;
        padding: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        width: 16rem;
        z-index: 100;
    }

    .section {
        margin-bottom: 1rem;
    }

    .section:last-child {
        margin-bottom: 0;
    }

    .section-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #64748b;
        margin: 0 0 0.5rem 0;
    }

    .color-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 0.5rem;
    }

    .color-button {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        border: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .color-button:hover {
        transform: scale(1.1);
    }

    .color-button.selected {
        border-color: #1e293b;
        transform: scale(1.1);
    }

    .slider-container {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .size-slider {
        flex: 1;
        -webkit-appearance: none;
        height: 6px;
        border-radius: 3px;
        background: #e2e8f0;
        outline: none;
    }

    .size-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: var(--thumb-color, #000);
        cursor: pointer;
    }

    .size-slider::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: var(--thumb-color, #000);
        cursor: pointer;
    }

    .size-value {
        font-size: 0.875rem;
        font-weight: 600;
        min-width: 3rem;
        text-align: right;
    }

    .advanced-toggle {
        background: none;
        border: none;
        color: #3b82f6;
        font-size: 0.875rem;
        cursor: pointer;
        padding: 0.25rem 0;
    }

    .advanced-options {
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid #e2e8f0;
    }

    .option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        cursor: pointer;
    }

    .option:last-child {
        margin-bottom: 0;
    }

    @media (max-width: 768px) {
        .menu {
            width: calc(100% - 2rem);
            left: 1rem;
            right: 1rem;
            top: auto;
            bottom: 1rem;
        }
    }
</style>