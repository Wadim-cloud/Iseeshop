<script lang="ts">
  import { supabase } from './supabase';
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Spinner from './Spinner.svelte';

  export let show: boolean;
  const dispatch = createEventDispatcher();

  let selectedProvider: 'google' | 'github' | null = null;
  let loading: 'google' | 'github' | null = null;
  let error: string | null = null;

  async function handleOAuthLogin(provider: 'google' | 'github') {
    loading = provider;
    error = null;

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: 'offline', prompt: 'consent' }
        }
      });

      if (authError) throw authError;
      dispatch('authSuccess');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      console.error(`${provider} login error:`, err);
      error = message;
      dispatch('authError', { message });
    } finally {
      loading = null;
      selectedProvider = null;
    }
  }

  function handleProviderClick(provider: 'google' | 'github') {
    console.log(`Provider clicked: ${provider}`);
    selectedProvider = provider;
    handleOAuthLogin(provider);
  }

  $: console.log('AuthModal show prop:', show);
</script>

{#if show}
  <div class="modal-overlay" transition:fade={{ duration: 300 }}>
    <div class="modal" transition:fly={{ y: 100, duration: 400 }}>
      <button
        class="close-button"
        on:click={() => {
          console.log('Close button clicked');
          show = false;
          selectedProvider = null;
          error = null;
        }}
        aria-label="Close authentication modal"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>

      <h2>Sign In to Pexos</h2>

      <div class="provider-buttons">
        <button
          class="provider-button google"
          on:click={() => handleProviderClick('google')}
          disabled={loading === 'google'}
          aria-label="Sign in with Google"
        >
          <span class="provider-icon">
            <img src="chimp.jpg" alt="Google" class="provider-pictogram" />
          </span>
          {#if loading === 'google'}
            <Spinner size="sm" color="white" />
          {:else}
            Sign in with Google
          {/if}
        </button>

        <button
          class="provider-button github"
          on:click={() => handleProviderClick('github')}
          disabled={loading === 'github'}
          aria-label="Sign in with GitHub"
        >
          <span class="provider-icon">
            <img src="frogger.jpg" alt="GitHub" class="provider-pictogram" />
          </span>
          {#if loading === 'github'}
            <Spinner size="sm" color="white" />
          {:else}
            Sign in with GitHub
          {/if}
        </button>
      </div>

      {#if error}
        <div class="error-message" role="alert">
          {error}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Your existing styles remain unchanged */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: #1c2526;
    padding: 2rem;
    border-radius: 12px;
    max-width: 420px;
    width: 90%;
    position: relative;
    box-shadow: 0 0 30px rgba(0, 123, 255, 0.3);
    border: 1px solid rgba(0, 123, 255, 0.2);
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    transition: transform 0.3s ease;
  }

  .close-button:hover {
    transform: rotate(90deg);
  }

  h2 {
    font-family: 'Stanley', sans-serif;
    font-size: 1.8rem;
    font-weight: 600;
    color: white;
    text-align: center;
    margin-bottom: 1.5rem;
    text-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
  }

  .provider-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .provider-button {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 15px rgba(0, 123, 255, 0.2);
  }

  .google {
    background: #4285f4;
  }

  .github {
    background: #24292e;
  }

  .provider-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(0, 123, 255, 0.4);
  }

  .provider-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
  }

  .provider-pictogram {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: grayscale(100%) brightness(1000%);
  }

  .error-message {
    margin-top: 1rem;
    color: #ff6b6b;
    text-align: center;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .modal {
      padding: 1.5rem;
      width: 95%;
    }
    h2 {
      font-size: 1.5rem;
    }
    .provider-button {
      padding: 0.7rem 1.2rem;
      font-size: 0.95rem;
    }
  }
</style>
