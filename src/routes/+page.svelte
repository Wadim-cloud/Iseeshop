<script lang="ts">
  import { page } from '$app/stores';
  import CanvasShader from '$lib/CanvasShader.svelte';
  import AuthModal from '$lib/AuthModal.svelte';
  import HomeComments from '$lib/HomeComments.svelte';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import { goto, invalidateAll } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';

  let showAuthModal = false;
  let showCommentModal = false;
  let loading = true;
  let session = null;

  // Cinematic effect states
  let contentReady = false;
  let elementsVisible = false;
  let titleVisible = false;
  let subtitleVisible = false;
  let headlineVisible = false;
  let buttonVisible = false;

  onMount(async () => {
    console.log('Root page mounted');
    try {
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session check error:', error.message);
      }
      session = initialSession;
      console.log('Initial session:', session ? 'User logged in' : 'No user');

      // Start cinematic sequence
      setTimeout(() => {
        loading = false;
        setTimeout(() => contentReady = true, 300);
        setTimeout(() => elementsVisible = true, 800);
        setTimeout(() => titleVisible = true, 1300);
        setTimeout(() => subtitleVisible = true, 1800);
        setTimeout(() => headlineVisible = true, 2200);
        setTimeout(() => buttonVisible = true, 2800);
      }, 1000);

      const redirectTo = $page.url.searchParams.get('redirect');
      if (redirectTo) {
        console.log('Redirect param:', redirectTo);
        localStorage.setItem('sb-redirect', decodeURIComponent(redirectTo));
        if (!session) {
          console.log('No session, showing auth modal');
          showAuthModal = true;
        } else {
          console.log('User already signed in, redirecting to:', redirectTo);
          goto(decodeURIComponent(redirectTo), { replaceState: true });
        }
      }

      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.email);
        session = newSession;

        if (event === 'SIGNED_IN' && newSession) {
          await invalidateAll();
          const redirect = localStorage.getItem('sb-redirect') || '/';
          localStorage.removeItem('sb-redirect');
          console.log('Redirecting after sign-in:', redirect);
          goto(redirect, { replaceState: true });
        }
      });

      return () => authListener.subscription.unsubscribe();
    } catch (err) {
      console.error('Session check failed:', err);
      loading = false;
    }
  });

  function handleButtonClick() {
    if (session) {
      console.log('User logged in, toggling comment modal');
      showCommentModal = true;
    } else {
      console.log('No user, showing auth modal');
      showAuthModal = true;
    }
    console.log('Modal states:', { showAuthModal, showCommentModal });
  }
</script>

<svelte:head>
  <title>Pexos - Creative Platform</title>
  <meta name="description" content="A collaborative creative platform for drawing, plotting, selling, and solving challenges." />
</svelte:head>

{#if loading}
  <div class="loader-container" role="status" aria-live="polite">
    <div class="loader-overlay"></div>
    <div class="loader-content">
      <img src="/logo192.png" alt="Pexos Logo" class="loader-logo floating" />
      <p class="loader-text">Initializing Pexos...</p>
    </div>
  </div>
{:else}
  <div class="hero-container">
    <div class="shader-layer" class:active={contentReady}>
      <CanvasShader />
    </div>
    <div class="overlay-layer" class:fade-out={contentReady}></div>

    <!-- Decorative elements -->
    <div class="deco-element top-right" class:visible={elementsVisible}></div>
    <div class="deco-element bottom-left" class:visible={elementsVisible}></div>
    <div class="deco-element center-glow" class:visible={elementsVisible}></div>

    <div class="hero-content">
      {#if titleVisible}
        <div in:fly={{ y: 50, duration: 1000 }}>
          <img src="/logo192.png" alt="Pexos Logo" class="hero-logo" />
        </div>
      {/if}

      {#if titleVisible}
        <div in:fly={{ y: 50, duration: 1000, delay: 200 }}>
          <h1 class="hero-title">Pexos</h1>
        </div>
      {/if}

      {#if subtitleVisible}
        <div in:fly={{ y: 30, duration: 800, delay: 300 }}>
          <p class="hero-subtitle">A Collaborative Creative Platform</p>
        </div>
      {/if}

      {#if headlineVisible}
        <div in:fly={{ x: -100, duration: 1000, delay: 400 }} class="headline-section">
          <h2 class="hero-headline">
            {#if session}
              Welcome back, {session.user.email}!
            {:else}
              Join the Pexos community and unleash your creativity!
            {/if}
            Create, Plot, Sell, and Solve Community Challenges
          </h2>
        </div>
      {/if}

      {#if buttonVisible}
        <div in:fade={{ duration: 800, delay: 500 }}>
          <button
            class="action-button"
            on:click={handleButtonClick}
            on:keydown={(e) => (e.key === 'Enter' || e.key === 'Space') && handleButtonClick()}
            aria-label={session ? 'View comments' : 'Sign in to Pexos'}
          >
            <span class="button-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                {#if session}
                  <path
                    d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
                    fill="white"
                  />
                {:else}
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"
                    fill="white"
                  />
                {/if}
              </svg>
            </span>
            {session ? 'View Comments' : 'Sign In'}
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

{#if showAuthModal}
  <div class="modal-debug">Auth Modal should be visible</div>
  <AuthModal
    bind:show={showAuthModal}
    on:authSuccess={async () => {
      console.log('Auth success event');
      await invalidateAll();
      const redirectTo = localStorage.getItem('sb-redirect') || '/';
      localStorage.removeItem('sb-redirect');
      console.log('Redirecting after auth success:', redirectTo);
      goto(redirectTo, { replaceState: true });
    }}
    on:authError={({ detail }) => {
      console.log('Auth error:', detail.message);
      showAuthModal = false;
    }}
  />
{/if}

{#if showCommentModal}
  <div class="modal-debug">Comment Modal should be visible</div>
  <HomeComments bind:show={showCommentModal} />
{/if}

<style>
  .loader-container, .hero-container {
    display: flex;
    height: 100vh;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .loader-container {
    background: #0a0a0a;
    justify-content: center;
    align-items: center;
  }

  .hero-container {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #0a0a0a 0%, #1c2526 100%);
  }

  .loader-overlay, .overlay-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 10;
    transition: opacity 1.5s ease;
  }

  .overlay-layer.fade-out {
    opacity: 0;
  }

  .shader-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    transform: scale(1.1);
    transition: all 2.5s ease;
    z-index: 2;
  }

  .shader-layer.active {
    opacity: 0.6;
    transform: scale(1);
  }

  .deco-element {
    position: absolute;
    opacity: 0;
    transition: opacity 1.5s ease, transform 1.5s ease;
    z-index: 3;
  }

  .deco-element.top-right {
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(0, 123, 255, 0.2) 0%, transparent 70%);
    transform: translate(50px, -50px);
  }

  .deco-element.bottom-left {
    bottom: 0;
    left: 0;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(0, 123, 255, 0.2) 0%, transparent 70%);
    transform: translate(-50px, 50px);
  }

  .deco-element.center-glow {
    top: 50%;
    left: 50%;
    width: 50%;
    height: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    background: radial-gradient(circle, rgba(0, 123, 255, 0.1) 0%, transparent 70%);
    box-shadow: 0 0 50px rgba(0, 123, 255, 0.2);
  }

  .deco-element.visible {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  .deco-element.top-right.visible, .deco-element.bottom-left.visible {
    transform: translate(0, 0);
  }

  .loader-content, .hero-content {
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    padding: 2rem;
  }

  .loader-logo {
    width: 100px;
    filter: drop-shadow(0 0 15px rgba(0, 123, 255, 0.5));
  }

  .loader-text {
    font-size: 1.2rem;
    font-weight: 400;
    letter-spacing: 1.5px;
    color: rgba(255, 255, 255, 0.8);
  }

  .hero-logo {
    width: 120px;
    margin-bottom: 1.5rem;
    filter: drop-shadow(0 0 20px rgba(0, 123, 255, 0.5));
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    letter-spacing: 4px;
    text-shadow: 0 0 25px rgba(0, 123, 255, 0.5);
    margin: 0.5rem 0;
  }

  .hero-subtitle {
    font-size: 1.3rem;
    font-weight: 300;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 2rem;
  }

  .headline-section {
    position: absolute;
    top: 20px;
    left: 20px;
    max-width: 800px;
    text-align: left;
    z-index: 30;
  }

  .hero-headline {
    font-size: 2.5rem;
    font-weight: 600;
    line-height: 1.4;
    color: #ffffff;
    text-shadow: 0 0 20px rgba(0, 123, 255, 0.6);
    padding: 1.5rem;
    background: linear-gradient(90deg, rgba(0, 123, 255, 0.2), rgba(0, 123, 255, 0.3));
    border-radius: 10px;
    border: 1px solid rgba(0, 123, 255, 0.4);
    text-align: left;
  }

  .action-button {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 2rem;
    font-size: 1.1rem;
    font-weight: 500;
    color: white;
    background: #1c2526;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 15px rgba(0, 123, 255, 0.3);
  }

  .action-button:hover {
    background: #2a3439;
    box-shadow: 0 0 20px rgba(0, 123, 255, 0.5);
    transform: translateY(-2px);
  }

  .button-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  .floating {
    animation: float 3s ease-in-out infinite;
  }

  .modal-debug {
    position: fixed;
    top: 10px;
    left: 10px;
    color: red;
    font-size: 14px;
    z-index: 2000;
  }

  @keyframes float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .hero-logo {
      width: 80px;
    }
    .hero-title {
      font-size: 2.5rem;
    }
    .hero-subtitle {
      font-size: 1rem;
    }
    .hero-headline {
      font-size: 1.8rem;
      padding: 1rem;
    }
    .action-button {
      padding: 0.6rem 1.5rem;
      font-size: 1rem;
    }
    .loader-logo {
      width: 80px;
    }
    .loader-text {
      font-size: 1rem;
    }
  }
</style>