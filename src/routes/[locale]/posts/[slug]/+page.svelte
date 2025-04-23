<script lang="ts">
  import { formatDate, t } from '$lib/i18n/translations';
  import { page } from '$app/stores';
  import PostLanguageSwitcher from '$lib/components/PostLanguageSwitcher.svelte';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  $: post = data.post;
  $: content = data.content;
  $: availableLocales = data.availableLocales;
  $: formattedDate = formatDate(new Date(post.date), $page.params.locale);
</script>

<svelte:head>
  <title>{post.title} | Gabriel's Blog</title>
  <meta name="description" content={post.excerpt} />
</svelte:head>

<main class="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-10 min-h-screen content-container rounded-lg shadow-md">
  <article>
    <header class="mb-8">
      <div class="mb-6">
        <a 
          href="/{$page.params.locale}" 
          class="btn-outline inline-flex items-center text-sm px-3 py-1 rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {$t('common.backToHome')}
        </a>
      </div>
      
      <div class="mb-4">
        <PostLanguageSwitcher slug={post.slug} {availableLocales} />
      </div>
      
      <h1 class="text-2xl sm:text-3xl font-bold mb-4 text-slate-800 dark:text-slate-200">{post.title}</h1>
      
      <div class="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
        <span>{formattedDate}</span>
        <span class="mx-2">•</span>
        <span>{post.readingTime} {$t('common.minRead')}</span>
      </div>
      
      {#if post.tags.length > 0}
        <div class="flex flex-wrap gap-2 mb-6">
          {#each post.tags as tag}
            <span class="tag">
              {tag}
            </span>
          {/each}
        </div>
      {/if}
    </header>
    
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <!-- Using @html is safe here as we control the content -->
      {@html content}
    </div>
  </article>
  
  <footer class="mt-16 sm:mt-20 pt-6 sm:pt-8 border-t border-green-100 dark:border-green-800/50 text-center text-slate-500 dark:text-slate-400 text-sm">
    <p>{$t('common.footer', { year: new Date().getFullYear().toString() })}</p>
  </footer>
</main>
