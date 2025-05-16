<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';

    let canvas;
    let ctx;
    let drawingId = '';
    let brushColor = 'black';
    let brushSize = 5;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let errorMessage = '';
    let showModal = false;
    let drawings = [];
    let isLoading = false;

    const colors = ['black', 'red', 'blue', 'green'];

    onMount(() => {
        ctx = canvas.getContext('2d');
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        // Mouse events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Touch events
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', stopDrawing);

        // Preload drawings
        preloadDrawings();

        return () => {
            // Cleanup event listeners
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', stopDrawing);
        };
    });

    async function preloadDrawings() {
        try {
            isLoading = true;
            const { data, error } = await supabase
                .from('drawings')
                .select('drawing_id, title, image_data')
                .limit(5)
                .order('created_at', { ascending: false });

            if (error) throw error;

            drawings = data || [];
            isLoading = false;
        } catch (error) {
            console.error('Error preloading drawings:', error);
            errorMessage = 'Failed to load drawings';
            isLoading = false;
        }
    }

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
    }

    function draw(e) {
        if (!isDrawing) return;

        e.preventDefault();
        const [x, y] = getCoordinates(e);

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.stroke();

        [lastX, lastY] = [x, y];
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        let x, y;

        if (e.type.startsWith('touch')) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        return [x, y];
    }

    function handleTouchStart(e) {
        e.preventDefault();
        startDrawing(e);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        draw(e);
    }

    async function loadBackground() {
        if (!drawingId.trim()) {
            errorMessage = 'Please enter a Drawing ID';
            return;
        }

        try {
            const { data, error } = await supabase
                .from('drawings')
                .select('image_data')
                .eq('drawing_id', drawingId)
                .single();

            if (error) throw error;

            if (data && data.image_data) {
                const img = new Image();
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = data.image_data;
                errorMessage = '';
            } else {
                errorMessage = 'No background image found for this drawing';
                clearCanvas();
            }
        } catch (error) {
            console.error('Error loading background:', error);
            errorMessage = 'Failed to load drawing';
        }
    }

    async function saveDrawing() {
        const imageData = canvas.toDataURL('image/png');

        try {
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData?.user?.id || 'user-uuid-placeholder';
            const userEmail = userData?.user?.email || 'user@example.com';

            // Derive username from email
            const username = userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user';

            // Count user's drawings for sequence number
            const { count, error: countError } = await supabase
                .from('drawings')
                .select('id', { count: 'exact' })
                .eq('user_id', userId);

            if (countError) throw countError;

            const sequence = (count || 0) + 1;
            const newDrawingId = `${username}-${sequence}`;

            const { error } = await supabase
                .from('drawings')
                .insert({
                    drawing_id: newDrawingId,
                    image_data: imageData,
                    title: 'New Drawing',
                    user_id: userId,
                    user_email: userEmail
                });

            if (error) throw error;

            errorMessage = '';
            alert('Drawing saved successfully with ID: ' + newDrawingId);
            drawingId = newDrawingId;
            await preloadDrawings();
        } catch (error) {
            console.error('Error saving drawing:', error);
            errorMessage = 'Failed to save drawing: ' + error.message;
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function selectDrawing(id) {
        drawingId = id;
        showModal = false;
        loadBackground();
    }

    function openModal() {
        showModal = true;
    }
</script>

<style>
    .container {
        font-family: Arial, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #f0f0f0;
        padding: 20px;
    }
    canvas {
        border: 2px solid #333;
        background-color: white;
    }
    .controls {
        margin: 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    button,
    input,
    select {
        padding: 8px;
        font-size: 16px;
    }
    .error {
        color: red;
        margin-top: 10px;
    }
    .modal {
        position: fixed;
        top: 50%;
        leftSteven Seminsky
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        max-width: 500px;
        width: 100%;
        z-index: 1000;
    }
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }
    .modal-content {
        max-height: 400px;
        overflow-y: auto;
    }
    .drawing-item {
        display: flex;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
    }
    .drawing-item:hover {
        background: #f5f5f5;
    }
    .drawing-preview {
        width: 80px;
        height: 60px;
        object-fit: cover;
        margin-right: 10px;
        border: 1px solid #ddd;
    }
    .drawing-info {
        flex: 1;
    }
    .modal-buttons {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
</style>

<div class="container">
    <div class="controls">
        <input type="text" bind:value={drawingId} placeholder="Enter Drawing ID" />
        <button on:click={openModal}>Choose Drawing</button>
        <button on:click={loadBackground}>Load Background</button>
        <button on:click={saveDrawing}>Save Drawing</button>
        <select bind:value={brushColor}>
            {#each colors as color}
                <option value={color}>{color}</option>
            {/each}
        </select>
        <input type="range" bind:value={brushSize} min="1" max="50" />
        <button on:click={clearCanvas}>Clear Canvas</button>
    </div>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
    <canvas bind:this={canvas} width="800" height="600"></canvas>
</div>

{#if showModal}
    <div class="modal-overlay" on:click={() => (showModal = false)}></div>
    <div class="modal">
        <h2>Select a Drawing</h2>
        <div class="modal-content">
            {#if isLoading}
                <p>Loading drawings...</p>
            {:else if drawings.length === 0}
                <p>No drawings found.</p>
            {:else}
                {#each drawings as drawing}
                    <div
                        class="drawing-item"
                        on:click={() => selectDrawing(drawing.drawing_id)}
                    >
                        {#if drawing.image_data}
                            <img
                                src={drawing.image_data}
                                alt="Preview"
                                class="drawing-preview"
                            />
                        {:else}
                            <div
                                class="drawing-preview"
                                style="display: flex; align-items: center; justify-content: center; background: #eee;"
                            >
                                No Image
                            </div>
                        {/if}
                        <div class="drawing-info">
                            <strong>{drawing.drawing_id}</strong>
                            {#if drawing.title}
                                <span> - {drawing.title}</span>
                            {/if}
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
        <div class="modal-buttons">
            <button on:click={() => (showModal = false)}>Close</button>
        </div>
    </div>
{/if}