<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  export let onClose: () => void;

  type Feature = {
    title: string;
    description?: string;
    route: string;
  };

  const features: Feature[] = [
    { title: 'Gallery', description: 'View all public drawings', route: '/gallery' },
    { title: 'Create Drawing', description: 'Start a new creative piece', route: '/create' },
    { title: 'Live Chat', description: 'Collaborate in real-time with others', route: '/chat' },
    { title: 'Account Settings', description: 'Manage your profile and preferences', route: '/settings' },
    { title: 'About Pexos', description: 'Learn more about this platform', route: '/about' },
    { title: 'Collaborate', description: 'Collaborate with Pexos', route: '/collaborate' },
    { title: 'Cross', description: 'Formation & Oragisation Logo', route: '/cross' },
  ];

  function handleClick(route: string) {
    goto(route);
    onClose();
  }

  onMount(() => {
    console.log('FeatureModal mounted');
  });
</script>

<div class="modal-overlay" on:click={onClose}>
  <div class="modal-content" on:click|stopPropagation>
    <button class="close-button" on:click={onClose}>×</button>
    <h2>Select a Feature</h2>

    <div class="features-list">
      {#each features as feature (feature.route)}
        <div class="feature" on:click={() => handleClick(feature.route)}>
          <h3>{feature.title}</h3>
          {#if feature.description}
            <p>{feature.description}</p>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
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
    margin-top: 0;
    font-size: 1.5rem;
    color: #333;
  }

  .features-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  .feature {
    padding: 1rem;
    background: #f1f1f1;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .feature:hover {
    background: #e0e0e0;
  }

  .feature h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
  }

  .feature p {
    margin: 0.25rem 0 0;
    color: #666;
    font-size: 0.9rem;
  }
</style>
