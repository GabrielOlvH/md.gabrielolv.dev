<script lang="ts">
  import { formatDate } from '$lib/i18n/translations';
  import { t, locale } from '$lib/i18n/translations';
  
  export let post: {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    readingTime: number;
    locale: string;
  };
  
  $: formattedDate = formatDate(new Date(post.date), $locale);
</script>

<article class="card p-4 sm:p-6 hover:shadow-md transition-all">
  <a href="/{$locale}/posts/{post.slug}" class="no-underline">
    <h2 class="text-lg sm:text-xl font-medium mb-2 text-slate-800 dark:text-slate-200 hover:text-green-700 dark:hover:text-green-400 transition-colors">{post.title}</h2>
  </a>
  
  <div class="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-3">
    <span>{formattedDate}</span>
    <span class="mx-2">•</span>
    <span>{post.readingTime} {$t('common.minRead')}</span>
  </div>
  
  {#if post.tags.length > 0}
    <div class="flex flex-wrap gap-2 mb-3">
      {#each post.tags as tag}
        <span class="tag">
          {tag}
        </span>
      {/each}
    </div>
  {/if}
  
  <p class="text-slate-600 dark:text-slate-300 font-light leading-relaxed">{post.excerpt}</p>
  
  <a href="/{$locale}/posts/{post.slug}" class="btn-outline inline-flex items-center mt-4 px-3 py-1 text-sm rounded-md group">
    <span>{$t('common.readMore')}</span>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </a>
</article>
