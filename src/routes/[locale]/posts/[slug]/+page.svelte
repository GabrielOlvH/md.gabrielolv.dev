<script lang="ts">
  import TableOfContentsDisplay from '$lib/components/TableOfContentsDisplay.svelte';
  import { formatDate, t } from '$lib/i18n/translations';
  import { page } from '$app/state';
  import PostLanguageSwitcher from '$lib/components/PostLanguageSwitcher.svelte';
  import FileExplorer from '$lib/components/FileExplorer.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import type { PageData } from './$types';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  
  export let data: PageData;
  
  $: post = data.post;
  $: content = data.content;
  $: availableLocales = data.availableLocales;
  $: items = data.items;
  $: formattedDate = formatDate(new Date(post.date), page.params.locale);
  
  // Analytics tracking variables
  let startTime: number;
  let maxScrollPercentage = 0;
  let lastScrollPosition = 0;
  let scrollDirectionChanges = 0;
  let totalScrollDistance = 0;
  let interactionEvents = 0;
  let readingTimeTracker: ReturnType<typeof setInterval> | null = null;
  let timeSpentSeconds = 0;
  let hasReachedEnd = false;
  let hasReachedMiddle = false;
  let inactiveTime = 0;
  let lastActivityTime = Date.now();
  
  // Track user activity
  function trackActivity() {
    lastActivityTime = Date.now();
    inactiveTime = 0;
  }
  
  // Track scroll behavior
  function handleScroll() {
    if (!browser) return;
    
    trackActivity();
    interactionEvents++;
    
    const articleElement = document.querySelector('article');
    if (!articleElement) return;
    
    // Calculate scroll metrics
    const docHeight = articleElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    const trackLength = docHeight - winHeight;
    const scrollPercentage = Math.floor((scrollTop / trackLength) * 100);
    
    // Track max scroll depth
    if (scrollPercentage > maxScrollPercentage) {
      maxScrollPercentage = scrollPercentage;
    }
    
    // Track scroll direction changes
    if ((scrollTop > lastScrollPosition && lastScrollPosition > 0) || 
        (scrollTop < lastScrollPosition && lastScrollPosition > 0)) {
      scrollDirectionChanges++;
    }
    
    // Track total scroll distance
    totalScrollDistance += Math.abs(scrollTop - lastScrollPosition);
    lastScrollPosition = scrollTop;
    
    // Track if user reached middle of article
    if (!hasReachedMiddle && scrollPercentage >= 50) {
      hasReachedMiddle = true;
      sendAnalyticsEvent('post_milestone', { milestone: 'middle', post_slug: post.slug });
    }
    
    // Track if user reached end of article
    if (!hasReachedEnd && scrollPercentage >= 90) {
      hasReachedEnd = true;
      sendAnalyticsEvent('post_milestone', { milestone: 'end', post_slug: post.slug });
    }
  }
  
  // Track user interactions with the content
  function handleInteraction(event: Event) {
    if (!browser) return;
    
    trackActivity();
    interactionEvents++;
    
    // Track specific interactions like clicks on links, code blocks, etc.
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      sendAnalyticsEvent('link_click', { 
        post_slug: post.slug,
        link_text: target.textContent || '',
        link_url: (target as HTMLAnchorElement).href
      });
    } else if (target.tagName === 'PRE' || target.closest('pre')) {
      sendAnalyticsEvent('code_interaction', { 
        post_slug: post.slug,
        code_language: target.closest('pre')?.querySelector('code')?.className.replace('language-', '') || 'unknown'
      });
    }
  }
  
  // Send analytics event to the server
  async function sendAnalyticsEvent(eventType: string, eventData: Record<string, any>) {
    if (!browser) return;
    
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blobs: [
            location.pathname,
            eventType,
            post.slug,
            eventData.milestone || '',
            navigator.language
          ],
          doubles: [
            1, // Count
            timeSpentSeconds,
            maxScrollPercentage,
            interactionEvents
          ],
          indexes: [
            localStorage.getItem('blog_visitor_id') || crypto.randomUUID()
          ],
          eventType,
          eventData
        }),
        keepalive: true
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }
  
  // Send final engagement metrics before user leaves
  function sendEngagementMetrics() {
    if (!browser || !post) return;
    
    sendAnalyticsEvent('post_engagement', {
      post_slug: post.slug,
      time_spent_seconds: timeSpentSeconds,
      max_scroll_percentage: maxScrollPercentage,
      scroll_direction_changes: scrollDirectionChanges,
      total_scroll_distance: Math.round(totalScrollDistance),
      interaction_events: interactionEvents,
      reached_end: hasReachedEnd,
      reached_middle: hasReachedMiddle
    });
  }
  
  onMount(() => {
    if (!browser) return;
    
    // Initialize tracking
    startTime = Date.now();
    
    // Set up scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set up interaction event listeners
    const articleElement = document.querySelector('article');
    if (articleElement) {
      articleElement.addEventListener('click', handleInteraction);
    }
    
    // Track time spent on page
    readingTimeTracker = setInterval(() => {
      // Check if user is still active
      const currentTime = Date.now();
      inactiveTime = currentTime - lastActivityTime;
      
      // Only count time if user is active (less than 30 seconds of inactivity)
      if (inactiveTime < 30000) {
        timeSpentSeconds++;
      }
      
      // Send periodic updates for long reading sessions
      if (timeSpentSeconds > 0 && timeSpentSeconds % 60 === 0) {
        sendAnalyticsEvent('reading_time_update', {
          post_slug: post.slug,
          time_spent_seconds: timeSpentSeconds,
          max_scroll_percentage: maxScrollPercentage
        });
      }
    }, 1000);
    
    // Track initial page view for post
    sendAnalyticsEvent('post_view', { post_slug: post.slug });
    
    // Set up activity tracking
    ['mousemove', 'keydown', 'click', 'touchstart'].forEach(eventType => {
      window.addEventListener(eventType, trackActivity, { passive: true });
    });
    
    // Track when user leaves the page
    window.addEventListener('beforeunload', sendEngagementMetrics);
  });
  
  onDestroy(() => {
    if (!browser) return;
    
    // Clean up event listeners
    window.removeEventListener('scroll', handleScroll);
    
    const articleElement = document.querySelector('article');
    if (articleElement) {
      articleElement.removeEventListener('click', handleInteraction);
    }
    
    ['mousemove', 'keydown', 'click', 'touchstart'].forEach(eventType => {
      window.removeEventListener(eventType, trackActivity);
    });
    
    window.removeEventListener('beforeunload', sendEngagementMetrics);
    
    // Clear interval
    if (readingTimeTracker) {
      clearInterval(readingTimeTracker);
    }
    
    // Send final engagement metrics
    sendEngagementMetrics();
  });
</script>

<SEO 
  title={`${post.title}`}
  description={post.excerpt}
  type="article"
  image={post.coverImage || '/images/og-image.jpg'}
  publishedTime={post.date}
  tags={post.tags}
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
                {#each post.tags as tag (tag)}
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
