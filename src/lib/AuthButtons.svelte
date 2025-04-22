<script lang="ts">
    import { supabase } from '$lib/supabase';
    import Spinner from './Spinner.svelte';
    import { createEventDispatcher } from 'svelte';
    import { goto } from '$app/navigation';
  
    const dispatch = createEventDispatcher<{
      authError: { message: string; provider: 'google' | 'github' }
    }>();
    
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
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        console.error(`${provider} login error:`, err);
        error = message;
        dispatch('authError', { message, provider });
      } finally {
        loading = null;
      }
    }
  </script>
  
  <div class="auth-buttons">
    <button
      class="auth-button google"
      on:click={() => handleOAuthLogin('google')}
      disabled={loading === 'google'}
      aria-label="Sign in with Google"
    >
      {#if loading === 'google'}
        <Spinner size="sm" color="white" />
      {:else}
        <span class="icon">
          <svg viewBox="0 0 24 24">
            <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.146-2.675-6.735-2.675-5.522 0-10 4.479-10 10s4.478 10 10 10c8.396 0 10-7.496 10-10 0-0.671-0.069-1.325-0.189-1.955h-9.811z" fill="white"/>
          </svg>
        </span>
      {/if}
      <span class="text">Continue with Google</span>
    </button>
  
    <button
      class="auth-button github"
      on:click={() => handleOAuthLogin('github')}
      disabled={loading === 'github'}
      aria-label="Sign in with GitHub"
    >
      {#if loading === 'github'}
        <Spinner size="sm" color="white" />
      {:else}
        <span class="icon">
          <svg viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="white"/>
          </svg>
        </span>
      {/if}
      <span class="text">Continue with GitHub</span>
    </button>
  
    {#if error}
      <div class="error-message" role="alert">
        {error}
      </div>
    {/if}
  </div>
  
  <style>
    .auth-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      max-width: 300px;
    }
  
    .auth-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      color: white;
    }
  
    .auth-button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
  
    .auth-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  
    .google { background: #db4437; }
    .google:hover:not(:disabled) { background: #c23321; }
    .github { background: #333; }
    .github:hover:not(:disabled) { background: #222; }
  
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
    }
  
    .error-message {
      color: #ff3333;
      font-size: 0.9rem;
      text-align: center;
      margin-top: 0.5rem;
    }
  
    @media (max-width: 768px) {
      .auth-buttons {
        max-width: 100%;
      }
    }
  </style>