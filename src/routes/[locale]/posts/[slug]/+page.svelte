<script lang="ts">
  import { formatDate, t } from '$lib/i18n/translations';
  import { page } from '$app/stores';
  import PostLanguageSwitcher from '$lib/components/PostLanguageSwitcher.svelte';
  import TableOfContents from '$lib/components/TableOfContents.svelte';
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

<!-- Main container with centered content -->
<div class="relative">
  <main class="min-h-screen py-8 sm:py-10">
    <!-- Mobile Table of Contents (shown at the top on small screens) -->
    <div class="lg:hidden max-w-3xl mx-auto px-4 sm:px-8 mb-6">
      <details class="toc-mobile-container">
        <summary class="toc-mobile-summary">
          <span class="text-lg font-bold text-white">Contents</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="pt-4">
          <TableOfContents />
        </div>
      </details>
    </div>
    
    <!-- Desktop layout with centered content and TOC on left -->
    <div class="relative max-w-3xl mx-auto px-4 sm:px-8">
      <!-- Left sidebar for table of contents (desktop only) -->
      <div class="hidden lg:block absolute right-full top-0 pr-8 w-64">
        <div class="fixed">
          <TableOfContents />
        </div>
      </div>
      
      <!-- Main content (centered) -->
      <div class="content-container rounded-lg shadow-md p-6 sm:p-8">
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
            
            <h1 class="text-2xl sm:text-3xl font-bold mb-4 text-white">{post.title}</h1>
            
            <div class="flex items-center text-sm text-gray-400 mb-4">
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
          
          <div class="prose prose-invert prose-green max-w-none">
            <!-- Using @html is safe here as we control the content -->
            {@html content}
          </div>
        </article>
        
        <footer class="mt-16 pt-6 border-t border-green-800/50 text-center text-gray-400 text-sm">
          <p>{$t('common.footer', { year: new Date().getFullYear().toString() })}</p>
        </footer>
      </div>
    </div>
  </main>
</div>

<style>
  .toc-mobile-container {
    background-color: transparent;
    padding: 0.5rem 0;
  }
  
  .toc-mobile-summary {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }
  
  details[open] .toc-mobile-summary svg {
    transform: rotate(180deg);
  }
</style>
