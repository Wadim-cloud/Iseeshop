<!-- src/lib/collaborate/OnlineUsers.svelte -->
<script lang="ts">
  export let onlineUsers: { user_id: string; email: string }[] = [];
</script>

<style>
  .online-users {
    margin-top: 10px;
    padding: 10px;
    background: #f9f9f9;
    border-radius: 8px;
    max-width: 300px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .user-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .user-list li {
    padding: 5px 0;
    font-size: 14px;
    color: #333;
  }
  h4 {
    margin: 0 0 8px;
    font-size: 16px;
    color: #444;
  }
  p {
    margin: 0;
    font-size: 14px;
    color: #666;
  }
</style>

<div class="online-users">
  {#if onlineUsers.length === 0}
    <p>No users online</p>
  {:else}
    <h4>Online Users ({onlineUsers.length})</h4>
    <ul class="user-list">
      {#each onlineUsers as user}
        <li>{user.email} (ID: {user.user_id.slice(0, 8)}...)</li>
      {/each}
    </ul>
  {/if}
</div>