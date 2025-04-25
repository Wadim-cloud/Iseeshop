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

  // Block grid setup
  const gridCols = 10;
  const gridRows = 5;

  function createBlocks() {
    return Array(50).fill().map((_, i) => ({
      id: i,
      isBlack: false,
      isBlue: false,
      isRed: false,
      navigateTo: null
    }));
  }

  let blocksGoogle = createBlocks();
  let blocksGitHub = createBlocks();
  let blackBlocksGoogle: number[] = [];
  let blackBlocksGitHub: number[] = [];

  function handleMouseMove(event, blocks, setBlocks) {
    const navbar = event.currentTarget;
    const rect = navbar.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const blockWidth = rect.width / gridCols;
    const blockHeight = rect.height / gridRows;
    const col = Math.floor(mouseX / blockWidth);
    const row = Math.floor(mouseY / blockHeight);
    const centerIndex = row * gridCols + col;

    let updated = blocks.map(block => ({ ...block, isBlue: false }));

    const distances = updated.map((block, index) => {
      const blockRow = Math.floor(index / gridCols);
      const blockCol = index % gridCols;
      const distance = Math.sqrt((blockCol - col) ** 2 + (blockRow - row) ** 2);
      return { index, distance };
    });

    distances.sort((a, b) => a.distance - b.distance);
    const nearestThree = distances.slice(0, 3).map(d => d.index);

    updated = updated.map((block, index) => ({
      ...block,
      isBlue: nearestThree.includes(index) && !block.isBlack
    }));

    if (centerIndex >= 0 && centerIndex < updated.length && !updated[centerIndex].isBlack) {
      setTimeout(() => {
        updated = updated.map((block, i) => ({
          ...block,
          isRed: i === centerIndex && !block.isBlack
        }));
        setBlocks([...updated]);
        setTimeout(() => {
          updated = updated.map((block, i) => ({
            ...block,
            isRed: i === centerIndex ? false : block.isRed
          }));
          setBlocks([...updated]);
        }, 500);
      }, 100);
    }

    setBlocks([...updated]);
  }

  function handleClick(index, blocks, setBlocks, blackBlocks, provider: 'google' | 'github') {
    if (blackBlocks.length < 2 && !blocks[index].isBlack) {
      const updated = blocks.map((block, i) => ({
        ...block,
        isBlack: i === index ? true : block.isBlack,
        isBlue: i === index ? false : block.isBlue,
        isRed: i === index ? false : block.isRed
      }));

      blackBlocks.push(index);
      setBlocks([...updated]);

      // Optional: Trigger provider login on first black block instead of navigation
      if (blackBlocks.length === 1) {
        handleProviderClick(provider);
      }
    }
    // Removed navigation on black block click to avoid unintended redirects
  }

  function handleMouseLeave(setBlocks, blocks) {
    setBlocks(blocks.map(block => ({ ...block, isBlue: false, isRed: false })));
  }

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
            <div
              class="navbar"
              on:mousemove={(e) => handleMouseMove(e, blocksGoogle, b => blocksGoogle = b)}
              on:mouseleave={() => handleMouseLeave(b => blocksGoogle = b, blocksGoogle)}
            >
              {#each blocksGoogle as block (block.id)}
                <div
                  class="block"
                  class:black={block.isBlack}
                  class:blue={block.isBlue}
                  class:red={block.isRed}
                  on:click|stopPropagation={() => handleClick(block.id, blocksGoogle, b => blocksGoogle = b, blackBlocksGoogle, 'google')}
                ></div>
              {/each}
            </div>
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
            <div
              class="navbar alt-theme"
              on:mousemove={(e) => handleMouseMove(e, blocksGitHub, b => blocksGitHub = b)}
              on:mouseleave={() => handleMouseLeave(b => blocksGitHub = b, blocksGitHub)}
            >
              {#each blocksGitHub as block (block.id)}
                <div
                  class="block"
                  class:black={block.isBlack}
                  class:alt-blue={block.isBlue}
                  class:alt-red={block.isRed}
                  on:click|stopPropagation={() => handleClick(block.id, blocksGitHub, b => blocksGitHub = b, blackBlocksGitHub, 'github')}
                ></div>
              {/each}
            </div>
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

  .provider-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .provider-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 15px;
  }

  .navbar {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 0.5px;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .block {
    background-color: rgba(255, 255, 255, 0.2);
    transition: background-color 0.3s;
  }

  .block:hover {
    cursor: pointer;
  }

  .blue { background-color: #007bff !important; }
  .red { background-color: #ff0000 !important; }
  .black { background-color: #000000 !important; }

  .alt-blue { background-color: #00cccc !important; }
  .alt-red { background-color: #ff8c00 !important; }

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
    .provider-icon {
      width: 40px;
      height: 10px;
    }
    .navbar {
      gap: 0.3px;
    }
  }
</style>