<script lang="ts">
    export let icon: string;
    export let ariaLabel: string = 'icon button';
    export let customClass: string = '';
  </script>
  
  <button
    class={`icon-button ${customClass}`}
    aria-label={ariaLabel}
    on:click
    on:focus
    on:blur
    on:mouseenter
    on:mouseleave
  >
    {@html icon}
  </button>
  
  <style>
    .icon-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
  
    .icon-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  
    .icon-button svg {
      width: 24px;
      height: 24px;
      stroke: currentColor;
    }
  </style>
  