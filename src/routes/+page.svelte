<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { defaultLocale } from '$lib/i18n';
  import { goto } from '$app/navigation';

  onMount(() => {
    if (browser) {
      const lang = navigator.language || '';
      const prefersPt = lang.startsWith('pt');
      const targetLocale = prefersPt ? '/pt' : `/${defaultLocale}`;
      
      // Use replaceState to avoid adding the root page to history
      goto(targetLocale, { replaceState: true }); 
    }
  });
</script>

<!-- Optional: Add a loading message or spinner -->
<div class="flex justify-center items-center min-h-screen">
  <p>Loading...</p> 
</div>
