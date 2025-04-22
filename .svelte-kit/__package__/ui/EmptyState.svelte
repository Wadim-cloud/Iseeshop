<script>
    export let message = "No items to display.";
    export let icon = "📭";
  </script>
  
  <div class="empty-state">
    <div class="icon">{icon}</div>
    <p>{message}</p>
  </div>
  
  <style>
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      color: #6b7280;
      text-align: center;
    }
  
    .icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
  
    p {
      font-size: 1.1rem;
    }
  </style>
  