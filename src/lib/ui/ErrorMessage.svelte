<script>
    export let message = "Something went wrong.";
  </script>
  
  <div class="error">
    <strong>Error:</strong> {message}
  </div>
  
  <style>
    .error {
      padding: 1rem 1.5rem;
      background-color: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
      border-radius: 0.5rem;
      margin: 1rem 0;
      font-weight: 500;
    }
  </style>
  