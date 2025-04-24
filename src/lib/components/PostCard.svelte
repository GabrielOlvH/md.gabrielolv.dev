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

<article class="card p-4 sm:p-5 hover:shadow-lg hover:shadow-green-900/30 transition-all duration-300 border-l-4 border-green-500 relative overflow-hidden group">
  <!-- Glow effect -->
  <div class="absolute -inset-1 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
  
  <!-- Card content -->
  <div class="relative z-10">
    <a href="/{$locale}/posts/{post.slug}" class="no-underline block">
      <h2 class="text-lg sm:text-xl font-bold mb-2 text-white group-hover:text-green-400 transition-all duration-300 transform group-hover:-translate-y-1">{post.title}</h2>
    </a>
    
    <div class="flex items-center text-xs text-gray-300 mb-3 font-medium">
      <span class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {formattedDate}
      </span>
      <span class="mx-2">•</span>
      <span class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {post.readingTime} {$t('common.minRead')}
      </span>
    </div>
    
    {#if post.tags.length > 0}
      <div class="flex flex-wrap gap-1 mb-3">
        {#each post.tags as tag}
          <span class="tag text-xs transform transition-transform duration-200 hover:scale-105 hover:shadow-md hover:shadow-green-900/20">
            {tag}
          </span>
        {/each}
      </div>
    {/if}
    
    <p class="text-gray-100 text-sm leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
    
    <a href="/{$locale}/posts/{post.slug}" class="btn-outline inline-flex items-center mt-1 px-3 py-1 text-xs rounded-md group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
      <span>{$t('common.readMore')}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </a>
  </div>
</article>
