<script lang="ts">
  import { page } from '$app/stores';
  import CanvasShader from '$lib/CanvasShader.svelte';
  import AuthModal from '$lib/AuthModal.svelte';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import { goto, invalidateAll } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';

  let showAuthModal = false;
  let loading = true;
  let session = null;
  
  // Cinematic effect states
  let contentReady = false;
  let elementsVisible = false;
  let titleVisible = false;
  let subtitleVisible = false;
  let headlineVisible = false;  // New state for headline
  let buttonVisible = false;

  onMount(async () => {
    console.log('Root page mounted');
    try {
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session check error:', error.message);
      }
      session = initialSession;
      
      // Start cinematic sequence after session check
      setTimeout(() => {
        loading = false;
        
        // Staggered animation sequence
        setTimeout(() => contentReady = true, 300);
        setTimeout(() => elementsVisible = true, 800);
        setTimeout(() => titleVisible = true, 1300);
        setTimeout(() => subtitleVisible = true, 1800);
        setTimeout(() => headlineVisible = true, 2200); // Show headline
        setTimeout(() => buttonVisible = true, 2800);  // Delayed button appearance
      }, 1000);

      const redirectTo = $page.url.searchParams.get('redirect');
      if (redirectTo) {
        console.log('Redirect param:', redirectTo);
        localStorage.setItem('sb-redirect', decodeURIComponent(redirectTo));
        if (!session) {
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

  const handleSignInClick = () => {
    console.log('Sign In button clicked');
    showAuthModal = true;
  };
</script>

<svelte:head>
  <title>Pexos - Creative Platform</title>
  <meta name="description" content="A collaborative creative platform" />
</svelte:head>

{#if loading}
  <div class="container cinematic-loader" role="status" aria-live="polite">
    <div class="overlay"></div>
    <div class="loading-content">
      <img
        src="/logo192.png"
        alt="Pexos Logo"
        class="logo-image floating"
      />
      <p class="loading-text floating">Loading Pexos...</p>
    </div>
  </div>
{:else}
  <div class="container cinematic-container">
    <div class="shader-background" class:active={contentReady}>
      <CanvasShader />
    </div>
    
    <!-- Cinematic overlay that fades out -->
    <div class="cinematic-overlay" class:fade-out={contentReady}></div>
    
    <!-- Decorative elements -->
    <div class="bg-element top-right" class:visible={elementsVisible}></div>
    <div class="bg-element bottom-left" class:visible={elementsVisible}></div>
    <div class="bg-element center-lines" class:visible={elementsVisible}></div>
    
    <div class="content cinematic-content">
      {#if titleVisible}
        <div in:fly={{ y: 30, duration: 1000 }}>
          <img src="/logo192.png" alt="Pexos Logo" class="logo-image" />
        </div>
      {/if}
      
      {#if titleVisible}
        <div in:fly={{ y: 30, duration: 1000, delay: 200 }}>
          <h1>Pexos</h1>
        </div>
      {/if}
      
      <div class="horizontal-bar" class:animate={subtitleVisible}></div>
      
      {#if subtitleVisible}
        <div in:fly={{ y: 20, duration: 800, delay: 300 }}>
          <p>A collaborative creative platform</p>
        </div>
      {/if}
      
      <!-- New headline section -->
      {#if headlineVisible}
        <div in:fly={{ y: 20, duration: 800, delay: 300 }} class="headline-container">
          <h2 class="main-headline">Create Drawings, Plot them, Sell them, Solve Community Challenges</h2>
        </div>
      {/if}
      
      {#if !showAuthModal && !session && buttonVisible}
        <div in:fade={{ duration: 800, delay: 200 }}>
          <button
            class="login-button"
            on:click={handleSignInClick}
            on:keydown={(e) => (e.key === 'Enter' || e.key === 'Space') && handleSignInClick()}
          >
            Sign In
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

{#if showAuthModal}
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

<style>
  .container {
    display: flex;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }

  .cinematic-container {
    background-color: #0a0a0a;
    color: white;
  }

  .cinematic-loader {
    background-color: #0a0a0a;
  }

  .cinematic-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 10;
    transition: opacity 1.8s cubic-bezier(0.19, 1, 0.22, 1);
    opacity: 1;
  }

  .cinematic-overlay.fade-out {
    opacity: 0;
  }

  .shader-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0.3;
    transform: scale(1.1);
    transition: all 3s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .shader-background.active {
    opacity: 0.7;
    transform: scale(1);
  }

  .bg-element {
    position: absolute;
    opacity: 0;
    transition: opacity 2s ease, transform 2s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 3;
  }

  .bg-element.top-right {
    top: 5%;
    right: 5%;
    width: 30%;
    height: 30%;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    transform: translate(20px, -20px);
  }

  .bg-element.bottom-left {
    bottom: 5%;
    left: 5%;
    width: 25%;
    height: 25%;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    transform: translate(-20px, 20px);
  }

  .bg-element.center-lines {
    top: 50%;
    left: 50%;
    width: 60%;
    height: 60%;
    transform: translate(-50%, -50%) scale(0.9);
    background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%);
    box-shadow: 0 0 40px rgba(0, 123, 255, 0.1);
  }

  .bg-element.visible {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  .bg-element.top-right.visible {
    opacity: 1;
    transform: translate(0, 0);
  }

  .bg-element.bottom-left.visible {
    opacity: 1;
    transform: translate(0, 0);
  }

  .horizontal-bar {
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.7), rgba(255,255,255,0));
    margin: 1.5rem 0;
    transition: width 1.8s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .horizontal-bar.animate {
    width: 40%;
  }

  .loading-content,
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 20;
    text-align: center;
  }

  .cinematic-content {
    background: transparent;
    color: white;
  }

  .loading-content {
    background: rgba(10, 10, 10, 0.9);
    color: white;
  }

  .logo-image {
    width: 80px;
    margin-bottom: 1rem;
    filter: drop-shadow(0 0 10px rgba(0, 123, 255, 0.5));
  }

  .loading-text {
    font-size: 1.2rem;
    color: white;
    font-weight: 500;
    letter-spacing: 1px;
  }

  h1 {
    font-size: 2.5rem;
    color: white;
    margin-bottom: 0.5rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-shadow: 0 0 20px rgba(0, 123, 255, 0.5);
  }

  p {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 1.5rem;
    font-weight: 300;
    letter-spacing: 1px;
  }

  /* New headline styles */
  .headline-container {
    width: 100%;
    max-width: 800px;
    margin: 1rem 0 2rem;
    padding: 0 1rem;
  }

  .main-headline {
    font-size: 1.75rem;
    font-weight: 600;
    color: #ffffff;
    text-shadow: 0 0 15px rgba(0, 123, 255, 0.6);
    line-height: 1.4;
    letter-spacing: 1px;
    margin-bottom: 2rem;
    background: linear-gradient(90deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.3), rgba(0, 123, 255, 0.1));
    padding: 1rem;
    border-radius: 5px;
    border-left: 3px solid rgba(0, 123, 255, 0.6);
    border-right: 3px solid rgba(0, 123, 255, 0.6);
  }

  .login-button {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 500;
    color: white;
    background-color: rgba(0, 123, 255, 0.2);
    border: 1px solid rgba(0, 123, 255, 0.6);
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 1px;
    backdrop-filter: blur(5px);
    box-shadow: 0 0 20px rgba(0, 123, 255, 0.2);
  }

  .login-button:hover {
    background-color: rgba(0, 123, 255, 0.4);
    box-shadow: 0 0 25px rgba(0, 123, 255, 0.4);
    transform: translateY(-2px);
  }

  .floating {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .logo-image {
      width: 60px;
    }
    .loading-text {
      font-size: 1rem;
    }
    h1 {
      font-size: 2rem;
    }
    p {
      font-size: 0.9rem;
    }
    .main-headline {
      font-size: 1.4rem;
      padding: 0.75rem;
    }
    .login-button {
      padding: 0.5rem 1.5rem;
      font-size: 0.9rem;
    }
    .horizontal-bar.animate {
      width: 60%;
    }
  }
</style>