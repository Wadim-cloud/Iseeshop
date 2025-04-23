<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import type { Session } from '@supabase/supabase-js';
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { get } from 'svelte/store';
  import Button from '$lib/components/base/button.svelte';
  import { mode, setMode } from 'mode-watcher';
  import { derived } from 'svelte/store';
  import { effect } from 'svelte';

  // Use $props() for runes mode
  let { session, onAuthToggle } = $props<{
    session: Session | null;
    onAuthToggle: () => void;
  }>();

  const navItems = [
    { name: 'Todo', href: '/todo', authRequired: true },
    { name: 'Gallery', href: '/gallery', authRequired: true },
    { name: 'Create', href: '/create', authRequired: true },
    { name: 'About', href: '/about', authRequired: true }
  ];

  // Reactive variables using $derived
const user = $derived(session?.user);
const avatarUrl = $derived(user?.user_metadata?.avatar_url || '/default-avatar.png');
const displayName = $derived(
  user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
);
const isCreatePage = $derived(get(page).url.pathname === '/create');

// Non-reactive variables
let isMobile = false;
let collapsed = true;
let forceDot = false;

// For debugging - replace the $: console.log with $effect
$effect(() => {
  console.log('Current mode:', mode);
});

  onMount(() => {
    setMode('light'); // Force light mode on load
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

  const handleCreateClick = async () => {
    forceDot = true;
    collapsed = true;
    await goto('/create');
  };

  // Explicit mode toggle
  const handleModeToggle = () => {
    const newMode = $mode === 'light' ? 'dark' : 'light';
    console.log('Toggling to mode:', newMode);
    setMode(newMode);
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
          <Button onclick={handleModeToggle} class="mode-toggle">
            {#if $mode === 'light'}
              Dark
            {:else}
              Light
            {/if}
          </Button>
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
          <Button onclick={handleModeToggle} class="mode-toggle">
            {#if $mode === 'light'}
              Dark
            {:else}
              Light
            {/if}
          </Button>
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
    background-color: var(--navbar-bg, #f8f9fa);
    box-shadow: 0 2px 6px var(--navbar-shadow, rgba(0, 0, 0, 0.05));
    position: sticky;
    top: 0;
    z-index: 1000;
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
    color: var(--text, #222);
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
  }

  .nav-link {
    text-decoration: none;
    color: var(--nav-link, #555);
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
    background-color: var(--nav-link-active, #007bff);
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
    color: var(--text, #333);
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
    background-color: var(--button-bg, #dc3545);
    color: var(--button-text, white);
    transition: all 0.2s ease;
  }

  .auth-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .mode-toggle {
    padding: 0.45rem 1rem;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    background-color: var(--mode-toggle-bg, #6c757d);
    color: var(--mode-toggle-text, white);
    transition: all 0.2s ease;
  }

  .mode-toggle:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .nav-dot {
    position: fixed;
    top: 1rem;
    left: 1rem;
    width: 48px;
    height: 48px;
    background-color: var(--nav-dot-bg, #007bff);
    border-radius: 50%;
    box-shadow: 0 2px 6px var(--mobile-menu-shadow, rgba(0, 0, 0, 0.3));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: pointer;
    opacity: 1;
  }

  .dot-tooltip {
    position: absolute;
    bottom: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    background-color: var(--text, #333);
    color: var(--background, white);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .nav-dot:hover .dot-tooltip {
    opacity: 1;
  }

  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--mobile-overlay-bg, rgba(0, 0, 0, 0.3));
    z-index: 15;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .mobile-menu {
    background-color: var(--mobile-menu-bg, #fff);
    width: 85%;
    max-width: 300px;
    height: 100%;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    z-index: 20;
    box-shadow: 2px 0 8px var(--mobile-menu-shadow, rgba(0, 0, 0, 0.1));
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