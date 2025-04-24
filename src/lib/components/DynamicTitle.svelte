<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';

  // Optional custom title to override the path-based title
  export let customTitle: string | null = null;
  
  // Optional suffix to append to the title (empty by default now)
  export let suffix: string = "";
  
  let title = '';
  let unsubscribe: () => void;
  
  onMount(() => {
    // Subscribe to page store to update title when route changes
    unsubscribe = page.subscribe(($page) => {
      if (customTitle) {
        // Use custom title if provided
        title = customTitle + suffix;
      } else {
        // Extract path from URL without domain
        const path = $page.url.pathname;
        
        // Remove locale prefix and format the path
        const pathWithoutLocale = path.replace(/^\/[a-z]{2}\//, '/');
        
        // If it's the home page, show the domain
        if (pathWithoutLocale === '/') {
          title = "md.gabrielolv.dev";
        } else {
          // Just use the path without any extra formatting
          const formattedPath = pathWithoutLocale.substring(1);
          title = formattedPath;
        }
      }
      
      // Update document title
      document.title = title;
    });
  });
  
  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });
</script>

<!-- This component doesn't render anything visible -->
