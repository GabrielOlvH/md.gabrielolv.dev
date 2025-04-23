<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { locales } from '$lib/i18n';
  
  export let slug: string;
  export let availableLocales: string[] = [];
  
  $: currentLocale = $page.params.locale || 'en';
  
  function switchLanguage(locale: string) {
    goto(`/${locale}/posts/${slug}`);
  }
</script>

{#if availableLocales.length > 1}
  <div class="flex items-center space-x-2 mb-4">
    <span class="text-sm text-slate-500 dark:text-slate-400">Available in:</span>
    <div class="flex space-x-1">
      {#each availableLocales as locale}
        <button
          class="px-2 py-1 text-xs rounded-md {locale === currentLocale ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}"
          on:click={() => switchLanguage(locale)}
          disabled={locale === currentLocale}
        >
          {locale.toUpperCase()}
        </button>
      {/each}
    </div>
  </div>
{/if}
