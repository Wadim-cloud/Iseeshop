<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import type { Session } from '@supabase/supabase-js';
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { get } from 'svelte/store';

  export let session: Session | null;
  export let onAuthToggle: () => void;

  const navItems = [
    { name: 'Todo', href: '/todo', authRequired: true },
    { name: 'Gallery', href: '/gallery', authRequired: true },
    { name: 'Create', href: '/create', authRequired: true },
    { name: 'About', href: '/about' }
  ];

  $: user = session?.user;
  $: avatarUrl = user?.user_metadata?.avatar_url || '/default-avatar.png';
  $: displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  $: isCreatePage = get(page).url.pathname === '/create';

  let isMobile = false;
  let collapsed = true;
  let forceDot = false; // Temporary state to force dot during navigation

  onMount(() => {
    const update = () => (isMobile = window.innerWidth <= 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  });

  const toggleCollapsed = () => {
    collapsed = !collapsed;
  };

  const handleClickOutside = () => {
    collapsed = true;
  };

  // Handle Create link click to ensure dot appears
  const handleCreateClick = async () => {
    forceDot = true; // Force dot rendering during navigation
    collapsed = true; // Close menu if open
    await goto('/create'); // Ensure navigation
  };
</script>

{#if (isMobile || isCreatePage || forceDot) && user}
  {#if collapsed}
    <div class="nav-dot" on:click={toggleCollapsed} in:fade>
      <span class="dot-tooltip">Menu</span>
    </div>
  {:else}
    <div class="mobile-overlay" on:click={handleClickOutside}>
      <nav class="mobile-menu" in:slide on:click|stopPropagation>
        <a href="/" class="brand" on:click={() => (collapsed = true)}>
          <img src="/logo192.png" alt="Pexos Logo" class="logo" />
          <span class="brand-name">Pexos</span>
        </a>

        <div class="nav-links">
          {#each navItems as item}
            {#if !item.authRequired || (item.authRequired && session)}
              <a
                href={item.href}
                class="nav-link"
                class:active={get(page).url.pathname === item.href}
                on:click={item.href === '/create' ? handleCreateClick : () => (collapsed = true)}
              >
                {item.name}
              </a>
            {/if}
          {/each}
        </div>

        <div class="auth-section" on:click|stopPropagation>
          <div class="user-profile">
            <img src={avatarUrl} alt="User Avatar" class="avatar" />
            <span class="username">{displayName}</span>
          </div>
          <button
            on:click={() => {
              collapsed = true;
              onAuthToggle();
            }}
            class="auth-button sign-out"
          >
            Sign Out
          </button>
        </div>
      </nav>
    </div>
  {/if}
{:else}
  <!-- Desktop nav -->
  <nav class="navbar" in:fade={{ duration: 200 }}>
    <div class="nav-container">
      <a href="/" class="brand">
        <img src="/logo192.png" alt="Pexos Logo" class="logo" />
        <span class="brand-name">Pexos</span>
      </a>

      <div class="nav-links">
        {#each navItems as item}
          {#if !item.authRequired || (item.authRequired && session)}
            <a
              href={item.href}
              class="nav-link"
              class:active={get(page).url.pathname === item.href}
              on:click={item.href === '/create' ? handleCreateClick : undefined}
            >
              {item.name}
            </a>
          {/if}
        {/each}
      </div>

      <div class="auth-section">
        {#if user}
          <div class="user-profile">
            <img src={avatarUrl} alt="User Avatar" class="avatar" />
            <span class="username">{displayName}</span>
          </div>
          <button on:click={onAuthToggle} class="auth-button sign-out">Sign Out</button>
        {/if}
      </div>
    </div>
  </nav>
{/if}

<style>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #f8f9fa;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .brand {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  .logo {
    height: 36px;
    margin-right: 0.5rem;
  }

  .brand-name {
    font-size: 1.4rem;
    font-weight: 700;
    color: #222;
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
  }

  .nav-link {
    text-decoration: none;
    color: #555;
    font-weight: 500;
    padding: 0.5rem 0;
    position: relative;
  }

  .nav-link.active::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #007bff;
  }

  .auth-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .username {
    font-size: 0.9rem;
    color: #333;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .auth-button {
    padding: 0.45rem 1rem;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    background-color: #dc3545;
    color: white;
    transition: all 0.2s ease;
  }

  .auth-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .nav-dot {
    position: fixed;
    top: 1rem;
    left: 1rem;
    width: 48px;
    height: 48px;
    background-color: #007bff;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    cursor: pointer;
  }

  .dot-tooltip {
    position: absolute;
    bottom: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    background-color: #333;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 15;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .mobile-menu {
    background-color: #fff;
    width: 85%;
    max-width: 300px;
    height: 100%;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    z-index: 20;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    .navbar {
      flex-direction: column;
      padding: 1rem;
      gap: 1rem;
    }

    .nav-container {
      flex-direction: column;
    }

    .nav-links {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .auth-section {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>