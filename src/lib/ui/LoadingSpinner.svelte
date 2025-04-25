<script>
    export let message = "Loading...";
  </script>
  
  <div class="spinner-container">
    <div class="spinner"></div>
    <p>{message}</p>
  </div>
  
  <style>
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: #555;
    }
  
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-left-color: #4f46e5;
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
  
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  </style>
  