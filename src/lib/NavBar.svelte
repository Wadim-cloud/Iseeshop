<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import { derived, writable } from 'svelte/store';
  import AuthModal from '$lib/AuthModal.svelte';
  import { supabase, getCurrentUser, subscribeToTable } from '$lib/supabase';
  import { notificationStore, markNotificationsAsRead } from '$lib/stores/notifications';

  export let session;
  export let onAuthToggle;

  const sessionStore = writable(session);
  $: sessionStore.set(session);

  const user = derived(sessionStore, ($session) => $session?.user || null);
  const avatarUrl = derived(user, ($user) => $user?.user_metadata?.avatar_url || '/default-avatar.png');
  const displayName = derived(user, ($user) => $user?.user_metadata?.full_name || $user?.email?.split('@')[0] || 'User');

  let showAuthModal = false;
  let showNotifications = false;
  let notifications = [];

  async function fetchNotifications() {
    const user = await getCurrentUser();
    if (!user) return;
    const { data, error } = await supabase
      .from('notifications')
      .select('id, message, drawing_id, sent, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) notifications = data;
  }

  async function handleNotificationClick(notification) {
    await markNotificationsAsRead(notification.user_id, [notification.id]);
    if (notification.drawing_id) goto(`/gallery/${notification.drawing_id}`);
  }

  $: if (showNotifications) fetchNotifications();

  function handleSignInClick() {
    showAuthModal = true;
  }

  const gridCols = 10, gridRows = 5;
  const blockCount = gridCols * gridRows;

  function createBlocks() {
    return Array(blockCount).fill(null).map((_, i) => ({
      id: i, isBlack: false, isBlue: false, isRed: false, navigateTo: null
    }));
  }

  let blocks1 = createBlocks(), blocks2 = createBlocks(), blocks3 = createBlocks();
  let blackBlocks1 = [], blackBlocks2 = [], blackBlocks3 = [];

  function notifyLoginRequired() {
    alert('Please log in to access this feature.');
    handleSignInClick();
  }

  function handleMouseMove(event, blocks, updateBlocks) {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const blockWidth = 200 / gridCols;
    const blockHeight = 50 / gridRows;
    const col = Math.floor(mouseX / blockWidth);
    const row = Math.floor(mouseY / blockHeight);
    const centerIndex = row * gridCols + col;

    let updated = blocks.map((block) => ({ ...block, isBlue: false }));

    const distances = updated.map((block, index) => {
      const blockRow = Math.floor(index / gridCols);
      const blockCol = index % gridCols;
      const distance = Math.sqrt((blockCol - col) ** 2 + (blockRow - row) ** 2);
      return { index, distance };
    });

    distances.sort((a, b) => a.distance - b.distance);
    const nearestThree = distances.slice(0, 3).map((d) => d.index);

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
        updateBlocks([...updated]);
        setTimeout(() => {
          updated = updated.map((block, i) => ({
            ...block,
            isRed: i === centerIndex ? false : block.isRed
          }));
          updateBlocks([...updated]);
        }, 500);
      }, 100);
    }

    updateBlocks([...updated]);
  }

  function handleClick(index, blocks, updateBlocks, blackBlocks) {
    if (!$user) return notifyLoginRequired();

    if (blackBlocks.length < 2 && !blocks[index].isBlack) {
      const updated = blocks.map((block, i) => ({
        ...block,
        isBlack: i === index ? true : block.isBlack,
        isBlue: i === index ? false : block.isBlue,
        isRed: i === index ? false : block.isRed
      }));

      blackBlocks.push(index);
      updated[index].navigateTo = blackBlocks.length === 1 ? '/create' : '/gallery';
      updateBlocks([...updated]);
    } else if (blocks[index].isBlack && blocks[index].navigateTo) {
      goto(blocks[index].navigateTo);
    }
  }

  function handleMouseLeave(updateBlocks, blocks) {
    updateBlocks(blocks.map((block) => ({ ...block, isBlue: false, isRed: false })));
  }

  function navigateTo(route) {
    if ($user) goto(route);
    else notifyLoginRequired();
  }
</script>

<!-- NAVBAR -->
<div class="navbar-row">
  <!-- Row 1 -->
  <div class="navbar" on:mousemove={(e) => handleMouseMove(e, blocks1, (b) => (blocks1 = b))} on:mouseleave={() => handleMouseLeave((b) => (blocks1 = b), blocks1)}>
    {#each blocks1 as block (block.id)}
      <div
        class="block"
        class:black={block.isBlack}
        class:blue={block.isBlue}
        class:red={block.isRed}
        on:click={() => handleClick(block.id, blocks1, (b) => (blocks1 = b), blackBlocks1)}
      />
    {/each}
  </div>
  <div class="label-box" on:click={() => navigateTo('/create')}>Create</div>

  <!-- Row 2 -->
  <div class="navbar" on:mousemove={(e) => handleMouseMove(e, blocks2, (b) => (blocks2 = b))} on:mouseleave={() => handleMouseLeave((b) => (blocks2 = b), blocks2)}>
    {#each blocks2 as block (block.id)}
      <div
        class="block"
        class:black={block.isBlack}
        class:alt-blue={block.isBlue}
        class:alt-red={block.isRed}
        on:click={() => handleClick(block.id, blocks2, (b) => (blocks2 = b), blackBlocks2)}
      />
    {/each}
  </div>
  <div class="label-box" on:click={() => navigateTo('/todo')}>List</div>
  <div class="label-box" on:click={() => navigateTo('/gallery')}>Gallery</div>

  <!-- Row 3 -->
  <div class="navbar" on:mousemove={(e) => handleMouseMove(e, blocks3, (b) => (blocks3 = b))} on:mouseleave={() => handleMouseLeave((b) => (blocks3 = b), blocks3)}>
    {#each blocks3 as block (block.id)}
      <div
        class="block"
        class:black={block.isBlack}
        class:alt2-blue={block.isBlue}
        class:alt2-red={block.isRed}
        on:click={() => handleClick(block.id, blocks3, (b) => (blocks3 = b), blackBlocks3)}
      />
    {/each}
  </div>

  <!-- Menu Bar -->
  <div class="menu-bar">
    {#if $user}
      <div class="menu-block" on:click={() => (showNotifications = !showNotifications)} title="Notifications">
        🔔
        {#if $notificationStore.unreadCount > 0}
          <span class="badge">{$notificationStore.unreadCount}</span>
        {/if}
      </div>
      <div class="menu-block logout" on:click={onAuthToggle} title="Logout">🚪</div>
      <div class="menu-block avatar" on:click={() => navigateTo('/profile')} title="Profile">
        <img src={$avatarUrl} alt="avatar" class="avatar-image" />
      </div>
    {:else}
      <div class="menu-block login" on:click={handleSignInClick} title="Login">🔑</div>
      <div class="menu-block about" on:click={() => navigateTo('/about')} title="About">ℹ️</div>
    {/if}
  </div>
</div>

<!-- Notifications Popup -->
{#if showNotifications}
  <div class="notifications-popup">
    {#each notifications as n}
      <div class="notification-item" on:click={() => handleNotificationClick(n)}>
        <div class="notif-header">
          <span class="notif-icon">🖼️</span>
          <span class="notif-message">{n.message}</span>
        </div>
        <div class="notif-time">{new Date(n.created_at).toLocaleString()}</div>
      </div>
    {/each}
    {#if notifications.length === 0}
      <div class="notification-item">No notifications</div>
    {/if}
  </div>
{/if}

<!-- Auth Modal -->
{#if showAuthModal}
  <AuthModal
    bind:show={showAuthModal}
    on:authSuccess={async () => {
      await invalidateAll();
      const redirectTo = localStorage.getItem('sb-redirect') || '/';
      localStorage.removeItem('sb-redirect');
      goto(redirectTo, { replaceState: true });
    }}
    on:authError={() => (showAuthModal = false)}
  />
{/if}

<style>
  /* Navbar Styles */
  .navbar-row {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .navbar {
    width: 200px;
    height: 50px;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 1px;
    background-color: #f0f0f0;
  }

  .block {
    background-color: #ccc;
    transition: background-color 0.3s;
  }

  .block:hover {
    cursor: pointer;
  }

  .blue {
    background-color: blue !important;
  }
  .red {
    background-color: red !important;
  }
  .black {
    background-color: black !important;
  }

  .alt-blue {
    background-color: teal !important;
  }
  .alt-red {
    background-color: orange !important;
  }

  .alt2-blue {
    background-color: purple !important;
  }
  .alt2-red {
    background-color: yellow !important;
  }

  .label-box {
    width: 200px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 20px;
    font-family: monospace;
    background-color: #eee;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .label-box:hover {
    background-color: #ddd;
    transform: scale(1.05);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  }

  /* Menu Bar Styles */
  .menu-bar {
    width: 200px;
    height: 50px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background-color: #222;
  }

  .menu-block {
    background-color: #555;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    overflow: hidden;
  }

  .menu-block:hover {
    filter: brightness(1.3);
    transform: scale(1.05);
  }

  .icon {
    stroke: white;
    width: 24px;
    height: 24px;
  }

  .logout {
    background-color: crimson;
  }
  .about {
    background-color: gold;
  }
  .login {
    background-color: green;
  }
  .avatar {
    background-color: #4a86e8;
  }

  .avatar-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  /* Notification Styles */
  .badge {
    background: red;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 10px;
    position: absolute;
    margin-left: -10px;
    margin-top: -10px;
  }

  .notifications-popup {
    position: absolute;
    top: 60px;
    right: 20px;
    background: white;
    border: 1px solid #ddd;
    width: 250px;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 10px;
    z-index: 9999;
  }

  .notification-item {
    padding: 8px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }

  .notif-header {
    display: flex;
    gap: 8px;
    align-items: center;
    font-weight: bold;
  }

  .notif-icon {
    font-size: 16px;
  }

  .notif-message {
    flex: 1;
  }

  .notif-time {
    font-size: 11px;
    color: #666;
    margin-top: 2px;
  }
</style>