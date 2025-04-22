<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { createEventDispatcher } from 'svelte';

  export let show: boolean;
  const dispatch = createEventDispatcher();

  async function signInWithProvider(provider: 'google' | 'github') {
    console.log('Initiating OAuth with:', provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) {
        console.error('OAuth error:', error.message);
        throw error;
      }
      console.log('OAuth initiated successfully');
      dispatch('authSuccess');
    } catch (error) {
      console.error('OAuth failed:', error);
      dispatch('authError', { message: error instanceof Error ? error.message : 'Authentication failed' });
    }
  }
</script>

{#if show}
  <div class="modal-overlay">
    <div class="modal">
      <button class="close-button" on:click={() => (show = false)}>×</button>
      <h2>Sign In</h2>
      <div class="provider-buttons">
        <button class="provider-button google" on:click={() => signInWithProvider('google')}>
          Sign in with Google
        </button>
        <button class="provider-button github" on:click={() => signInWithProvider('github')}>
          Sign in with GitHub
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 400px;
    width: 100%;
    position: relative;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .close-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .provider-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .provider-button {
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    color: white;
  }

  .google {
    background-color: #4285f4;
  }

  .github {
    background-color: #333;
  }

  .provider-button:hover {
    opacity: 0.9;
  }
</style>