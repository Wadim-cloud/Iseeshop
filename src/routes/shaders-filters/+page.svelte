<script>
    import { onMount } from 'svelte';
    import HopeFilter from '$lib/Hope.svelte'; // Import from $lib directory

    onMount(() => {
        document.title = 'Shaders & Filters';
    });
</script>

<svelte:head>
    <title>Shaders & Filters</title>
</svelte:head>

<main>
    <h1>Hope Poster Filter</h1>
    <p>Upload an image and apply the "Hope" poster effect.</p>

    <HopeFilter />

    </main>

<style>
    main {
        text-align: center;
        padding: 2rem;
        max-width: 600px;
        margin: 2rem auto;
        background: #fff3f0;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
        color: #ff3e00;
        font-size: 2.5em;
        font-weight: bold;
        margin-bottom: 10px;
    }

    p {
        font-size: 1.2em;
        color: #333;
        margin-bottom: 20px;
    }

    .filter-options {
        margin-top: 20px;
    }

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    select {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1em;
    }

    @media (min-width: 640px) {
        main {
            max-width: 700px;
        }
    }
</style>