<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  const supportedLocales = ['en', 'pt'];
  let currentLocale = 'en';
  
  $: {
    // Extract locale from URL path
    const pathParts = $page.url.pathname.split('/');
    const localeInPath = pathParts[1];
    
    if (supportedLocales.includes(localeInPath)) {
      currentLocale = localeInPath;
    } else {
      currentLocale = 'en'; // Default to English
    }
  }
  
  function toggleLanguage() {
    const newLocale = currentLocale === 'en' ? 'pt' : 'en';
    
    // Get current path without locale prefix
    const pathParts = $page.url.pathname.split('/');
    const pathWithoutLocale = pathParts.slice(2).join('/');
    
    // Navigate to the same page with new locale
    goto(`/${newLocale}/${pathWithoutLocale}`);
  }
</script>

<button
  aria-label="Toggle language"
  class="rounded-md p-2 text-green-700 hover:bg-green-100 hover:text-green-800 dark:text-green-300 dark:hover:bg-green-800 dark:hover:text-green-200 transition-colors"
  on:click={toggleLanguage}
>
  <span class="font-medium">
    {currentLocale === 'en' ? 'PT' : 'EN'}
  </span>
</button>
