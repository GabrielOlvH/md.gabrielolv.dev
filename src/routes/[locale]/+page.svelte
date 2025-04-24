<script lang="ts">
  import { t } from '$lib/i18n/translations';
  import PostCard from '$lib/components/PostCard.svelte';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  $: posts = data.posts;
  $: currentYear = new Date().getFullYear();
</script>

<main class="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-10 min-h-screen content-container rounded-lg shadow-md">
  <header class="mb-12 sm:mb-16 text-center">
    <h1 class="text-3xl sm:text-4xl font-bold mb-4 site-title">md.gabrielolv.dev</h1>
    <p class="text-gray-100 text-lg font-medium">{$t('home.subtitle')}</p>
  </header>
  
  <section>
    {#if posts.length > 0}
      <div class="grid gap-6 sm:gap-8">
        {#each posts as post}
          <PostCard {post} />
        {/each}
      </div>
    {:else}
      <div class="text-center py-12 px-4 sm:px-6 rounded-xl bg-green-900/20 border border-green-800/50">
        <p class="text-gray-100 font-medium">{$t('common.noPostsYet')}</p>
      </div>
    {/if}
  </section>
  
  <footer class="mt-16 sm:mt-20 pt-6 sm:pt-8 border-t border-green-800/50 text-center text-gray-400 text-sm">
    <p>{$t('common.footer', { year: currentYear.toString() })}</p>
  </footer>
</main>
