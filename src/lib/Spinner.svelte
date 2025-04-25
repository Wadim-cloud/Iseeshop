<script lang="ts">
    export let size: 'sm' | 'md' | 'lg' = 'md';
    export let color = 'currentColor';
    
    $: dimensions = {
      sm: '16px',
      md: '24px',
      lg: '32px'
    }[size];
  </script>
  
  <svg
    class="spinner"
    style={`width: ${dimensions}; height: ${dimensions}; color: ${color}`}
    viewBox="0 0 50 50"
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="currentColor"
      stroke-width="5"
    />
  </svg>
  
  <style>
    .spinner {
      animation: rotate 1s linear infinite;
    }
    
    circle {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }
    
    @keyframes rotate {
      100% { transform: rotate(360deg); }
    }
    
    @keyframes dash {
      0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
      50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
      100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
    }
  </style>