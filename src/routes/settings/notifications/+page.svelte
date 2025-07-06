<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { notificationStore, loadProfile, updateSettings, setupNotifications, cleanupSubscriptions } from '$lib/stores/notifications';
  import { messaging } from '$lib/firebase';
  import Toast from '$lib/Toast.svelte';

  $: ({ notifications, role, loading, error, success, toast } = $notificationStore);

async function handleSubmit() {
  console.log('handleSubmit: Submitting settings:', notifications);
  await updateSettings();
}

function handleToggle(type: string, enabled: boolean) {
  console.log(`handleToggle: Toggled ${type} to ${enabled}`);
}

onMount(async () => {
  console.log('onMount: Loading profile and setting up notifications');
  await loadProfile();
  await setupNotifications();
});

onDestroy(() => {
  console.log('onDestroy: Cleaning up subscriptions');
  cleanupSubscriptions();
});
</script>

<main>
<div class="settings-card">
  <h1>Notification Settings</h1>

  {#if loading}
    <div class="loading">
      <span class="spinner"></span>
      <span>Loading...</span>
    </div>
  {:else if error}
    <p class="alert alert-error">{error}</p>
  {:else if success}
    <p class="alert alert-success">{success}</p>
  {/if}

  {#if !loading && !error}
    <form on:submit|preventDefault={handleSubmit}>
      {#each Object.entries(notifications) as [type, enabled]}
        <div class="toggle-group">
          <span class="toggle-label">Notify me about {type.replace('_', ' ')}</span>
          <label class="toggle-switch" for={type}>
            <input
              type="checkbox"
              id={type}
              bind:checked={notifications[type]}
              on:change={() => handleToggle(type, notifications[type])}
              aria-label={`Toggle notifications for ${type.replace('_', ' ')}`}
            />
            <span class="slider">
              <span class="toggle-text">{notifications[type] ? 'On' : 'Off'}</span>
            </span>
          </label>
        </div>
      {/each}
      {#if Object.values(notifications).every((enabled) => !enabled)}
        <p class="warning">Disabling all notifications will stop push notifications.</p>
      {/if}
      <p class="role">Role: <span>{role || 'Not set'}</span></p>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  {/if}
</div>
</main>

<Toast message={toast.message} show={toast.show} type={toast.type} />

<style>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f9;
  padding: 1rem;
}

.settings-card {
  max-width: 400px;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #666;
  font-size: 1rem;
  margin: 1rem 0;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #ccc;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

.alert-error {
  background-color: #fee2e2;
  color: #dc2626;
}

.alert-success {
  background-color: #dcfce7;
  color: #15803d;
}

.warning {
  color: #d97706;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toggle-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.toggle-label {
  font-size: 1rem;
  color: #444;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 28px;
  cursor: pointer;
}

.toggle-switch input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  margin: 0;
  cursor: pointer;
  z-index: 1;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 28px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

input:checked + .slider {
  background-color: #3b82f6;
}

input:checked + .slider:before {
  transform: translateX(32px);
}

input:focus + .slider {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.toggle-text {
  font-size: 0.8rem;
  color: white;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

input:checked + .slider .toggle-text {
  left: 8px;
}

input:not(:checked) + .slider .toggle-text {
  right: 8px;
}

.role {
  font-size: 0.95rem;
  color: #666;
  margin: 0.5rem 0;
}

.role span {
  font-weight: 500;
  color: #333;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover:not(:disabled) {
  background-color: #2563eb;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>