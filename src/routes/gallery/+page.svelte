<!-- src/routes/gallery/+page.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import GalleryContainer from '$lib/gallery/GalleryContainer.svelte';
  </script>
  
  <svelte:head>
    <title>Gallery | Pexos</title>
    <meta name="description" content="Browse community creations" />
  </svelte:head>
  
  <GalleryContainer />