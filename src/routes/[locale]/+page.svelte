<script lang="ts">
  import { t } from '$lib/i18n/translations';
  import SEO from '$lib/components/SEO.svelte';
  import FileExplorer from '$lib/components/FileExplorer.svelte';
  import { page } from '$app/stores';
  import type { PageData } from './$types';

  export let data: PageData;

  $: currentYear = new Date().getFullYear();
</script>

<SEO
  title={$t('home.title')}
  description={$t('home.subtitle')}
  type="website"
  canonical={`https://md.gabrielolv.dev/${$page.params.locale}`}
/>

<main
  class="min-h-screen flex flex-col justify-center items-center py-8 sm:py-10"
>
  <div class="max-w-3xl w-full mx-auto sm:px-8">
    <div class="content-container rounded-lg shadow-md p-6 sm:p-8">
      <FileExplorer />

      <footer
        class=" text-center text-gray-400 text-sm"
      >
        <p>{$t('common.footer', { year: currentYear.toString() })}</p>
      </footer>
    </div>
  </div>
</main>
<style>
</style>
