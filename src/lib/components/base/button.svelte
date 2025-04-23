<script>
  let isDark = false;
  
  function toggleTheme() {
    isDark = !isDark;
    // You could implement actual theme switching logic here
    // document.documentElement.classList.toggle('dark');
  }
</script>

<div class="toggle-container {isDark ? 'dark-mode' : 'light-mode'}">
  <button on:click={toggleTheme} class="toggle-switch" aria-label="Toggle theme">
    <div class="toggle-slider">
      {#if isDark}
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
      {/if}
    </div>
  </button>
</div>

<style>
  .toggle-container {
    display: flex;
    justify-content: center;
    padding: 8px;
    transition: background-color 0.3s ease;
  }
  
  .toggle-switch {
    position: relative;
    width: 48px;
    height: 24px;
    border-radius: 12px;
    padding: 2px;
    cursor: pointer;
    background: none;
    border: none;
    transition: background-color 0.3s ease;
  }
  
  .light-mode .toggle-switch {
    background-color: #a5b4fc;
  }
  
  .dark-mode .toggle-switch {
    background-color: #4b5563;
  }
  
  .toggle-slider {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
  }
  
  .light-mode .toggle-slider {
    transform: translateX(0);
    color: #eab308;
  }
  
  .dark-mode .toggle-slider {
    transform: translateX(24px);
    color: #94a3b8;
  }
  
  .light-mode {
    background-color: #f9fafb;
    color: #1f2937;
  }
  
  .dark-mode {
    background-color: #1f2937;
    color: #f9fafb;
  }
</style>