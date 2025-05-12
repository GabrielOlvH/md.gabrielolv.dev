<script lang="ts">
  import TableOfContentsDisplay from '$lib/components/TableOfContentsDisplay.svelte';
  import { formatDate, t } from '$lib/i18n/translations';
  import { page } from '$app/state';
  import PostLanguageSwitcher from '$lib/components/PostLanguageSwitcher.svelte';
  import FileExplorer from '$lib/components/FileExplorer.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import { getAvailableLocalesForPost, getPostBySlug } from '$lib/utils/posts';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  const post = $derived(getPostBySlug(page.params.slug, page.params.locale)!);
  const content = $derived(post.content);
  const availableLocales = $derived(getAvailableLocalesForPost(page.params.slug));
  const items = $derived(post.toc);
  const formattedDate = $derived(formatDate(new Date(post.metadata.date), page.params.locale));
  
  onMount(() => {
    if (!browser) return;
  });
  
  onDestroy(() => {
    if (!browser) return;
  });
</script>

<SEO 
  title={`${post.metadata.title}`}
  description={post.metadata.excerpt}
  type="article"
  publishedTime={post.metadata.date}
  tags={post.metadata.tags}
  usePathAsTitle={true}
/>

<!-- Main container with centered content -->
<div class="relative">
  <main class="min-h-screen sm:py-10">

    
    <!-- Desktop layout with centered content -->
    <div class="relative max-w-3xl mx-auto sm:px-6">
      <TableOfContentsDisplay {items}/>

      <!-- Main content (centered) -->
      <div class="content-container rounded-lg shadow-md p-6 sm:p-8">
        <!-- File Explorer Navigation -->
        <FileExplorer />
        
        <article>
          <header class="mb-8">
            <div class="mb-4">
              <PostLanguageSwitcher slug={post.metadata.slug} {availableLocales} />
            </div>
            
            <h1 class="text-2xl sm:text-3xl font-bold mb-4 text-white">{post.metadata.title}</h1>
            
            <div class="flex items-center text-sm text-gray-400 mb-4">
              <span>{formattedDate}</span>
              <span class="mx-2">•</span>
              <span>{post.metadata.readingTime} {$t('common.minRead')}</span>
            </div>
            
            {#if post.metadata.tags.length > 0}
              <div class="flex flex-wrap gap-2 mb-6">
                {#each post.metadata.tags as tag (tag)}
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

</style>
