<script>
  export let drawingTitle;
</script>

<style>
  .title-input {
    background: #ffffffcc;
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .title-input label {
    font-size: 14px;
  }
  .title-input input {
    font-size: 14px;
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    width: 200px;
  }
</style>

<div class="title-input">
  <label>
    📝 Drawing Title
    <input
      type="text"
      bind:value={drawingTitle}
      placeholder="Enter drawing title"
    />
  </label>
</div>