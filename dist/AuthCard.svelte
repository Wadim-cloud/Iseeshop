<script>
    import { goto } from '$app/navigation';
    import { supabase } from './supabase.ts';

    export let user;
    export let avatarUrl = user?.user_metadata?.avatar_url || '';

    async function handleLogout() {
        await supabase.auth.signOut();
        goto('/');
    }

    function navigateTo(route) {
        goto(route);
    }
</script>

<style>
    .card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        padding: 20px; /* Reduced padding */
        width: 100%;
        max-width: 350px; /* Slightly reduced max-width */
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        margin-bottom: 20px;
        text-align: center; /* Center text within the card */
    }

    .avatar {
        width: 70px; /* Slightly reduced size */
        height: 70px; /* Slightly reduced size */
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #007bff;
        margin-bottom: 10px; /* Reduced margin */
    }

    .button-group {
        display: flex;
        flex-direction: column;
        gap: 8px; /* Reduced gap */
        margin-top: 15px; /* Reduced margin */
    }

    .button {
        padding: 10px; /* Reduced padding */
        font-size: 0.9rem; /* Slightly reduced font size */
        font-weight: bold;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: opacity 0.3s ease;
        width: 100%;
        text-align: center; /* Ensure button text is centered */
    }

    .button:hover {
        opacity: 0.8;
    }

    .todo { background: #007bff; }
    .create { background: #28a745; }
    .gallery { background: #ffc107; }
    .shaders { background: #6f42c1; } /* New background color for shaders */
    .logout { background: #dc3545; margin-top: 10px; }

    h1 {
        font-size: 1.5rem; /* Slightly reduced font size */
        margin-bottom: 10px; /* Reduced margin */
    }
</style>

<div class="card">
    <h1>Welcome, {user?.email}!</h1>
    {#if avatarUrl}
        <img src={avatarUrl} alt="User Avatar" class="avatar" />
    {/if}

    <div class="button-group">
        <button class="button todo" on:click={() => navigateTo('/todo')}>📋 Go to Todo</button>
        <button class="button create" on:click={() => navigateTo('/create')}>✨ Go to Create</button>
        <button class="button gallery" on:click={() => navigateTo('/gallery')}>🖼 Go to Gallery</button>
        <button class="button shaders" on:click={() => navigateTo('/shaders-filters')}>🎨 Go to Shaders & Filters</button>
    </div>

    <button class="button logout" on:click={handleLogout}>🔴 Logout</button>
</div>