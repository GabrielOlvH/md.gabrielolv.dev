<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Folder, FileText, ArrowUp, User, FilePen, Mail, Calendar } from 'lucide-svelte';
  import { formatDate, t, locale } from '$lib/i18n/translations';
  import { onMount } from 'svelte';
  import type { PostMetadata } from '$lib/utils/posts';
  import LanguageToggle from './LanguageToggle.svelte';

  export let posts: PostMetadata[] = [];

  // Current path from URL including locale
  $: currentPath = $page.url.pathname;
  $: currentLocale = $page.params.locale;
  
  let isMobile = false;
  let urlDisplayElement: HTMLElement;

  onMount(() => {
    // Check if we're on mobile
    isMobile = window.innerWidth < 640;
    
    // Add resize listener
    const handleResize = () => {
      isMobile = window.innerWidth < 640;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Scroll to the end of the path display
    if (urlDisplayElement) {
      urlDisplayElement.scrollLeft = urlDisplayElement.scrollWidth;
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  // Directory structure
  const fileSystem = {
    '/': {
      type: 'directory',
      children: {
        'about': { 
          type: 'directory', 
          icon: User,
          description: 'About me & contact information'
        },
        'contact': {
          type: 'directory',
          icon: Mail,
          description: 'Contact form'
        },
        'posts': { 
          type: 'directory', 
          icon: FilePen,
          description: 'Blog posts and articles',
          children: {}
        },
        'resume.pdf': { 
          type: 'file', 
          icon: FileText,
          description: 'My resume',
          url: '/resume.pdf'
        }
      }
    }
  };

  // Add posts to the filesystem structure
  $: {
    if (posts && posts.length > 0) {
      const postsDir = fileSystem['/'].children['posts'];
      // Clear existing posts first to prevent stale data
      postsDir.children = {};
      
      posts.forEach(post => {
        postsDir.children[`${post.slug}.md`] = {
          type: 'file',
          icon: FileText,
          description: post.excerpt,
          metadata: post,
          url: `/${currentLocale}/posts/${post.slug}`
        };
      });
    }
  }
  
  // Get current directory content
  function getCurrentDirContent() {
    // Remove locale from path for directory lookup
    const pathWithoutLocale = currentPath.replace(`/${currentLocale}`, '') || '/';
    const segments = pathWithoutLocale.split('/').filter(segment => segment.length > 0);
    let current = fileSystem['/'];
    
    // Handle root directory
    if (segments.length === 0) {
      return Object.entries(current.children).map(([name, info]) => ({
        name,
        ...info
      }));
    }
    
    // Check if we're in a post detail page
    if (segments.length > 1 && segments[0] === 'posts' && segments[1]) {
      // We're in a post detail page, show posts directory content
      const postsDir = current.children['posts'];
      if (postsDir && postsDir.type === 'directory') {
        // If we're on a post detail page, just show the posts directory
        return Object.entries(postsDir.children || {}).map(([name, info]) => ({
          name,
          ...info
        }));
      }
    }
    
    // Navigate to current directory
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      
      // Special case for post slugs - don't try to navigate into them
      if (i === 1 && segments[0] === 'posts' && segment !== 'posts') {
        // We're in a post detail page, stop navigation here
        break;
      }
      
      if (current.type !== 'directory' || !current.children[segment]) {
        return [];
      }
      current = current.children[segment];
    }
    
    // Return children of current directory
    if (current.type === 'directory' && current.children) {
      return Object.entries(current.children).map(([name, info]) => ({
        name,
        ...info
      }));
    }
    
    return [];
  }
  
  // Navigate to a path
  function navigateTo(path) {
    // If it's a file with a URL, navigate to that URL
    if (path.type === 'file' && path.url) {
      goto(path.url);
      return;
    }
    
    // Get path without locale
    const pathWithoutLocale = currentPath.replace(`/${currentLocale}`, '') || '/';
    
    // Otherwise navigate to the directory
    const newPath = pathWithoutLocale === '/' 
      ? `/${path.name}` 
      : `${pathWithoutLocale}/${path.name}`;
    
    goto(`/${currentLocale}${newPath}`);
  }
  
  // Go up one level
  function goUp() {
    // Get path without locale
    const pathWithoutLocale = currentPath.replace(`/${currentLocale}`, '') || '/';
    const segments = pathWithoutLocale.split('/').filter(segment => segment.length > 0);
    
    if (segments.length === 0) return;
    
    segments.pop();
    const newPath = segments.length === 0 ? '' : '/' + segments.join('/');
    goto(`/${currentLocale}${newPath}`);
  }
  
  // Get breadcrumb segments
  function getBreadcrumbs() {
    const breadcrumbs = [{ name: currentLocale, path: `/${currentLocale}` }];
    
    // Get segments including the locale
    const segments = currentPath.split('/').filter(segment => segment.length > 0);
    
    let currentBreadcrumbPath = `/${currentLocale}`;
    // Skip the locale segment which is already added
    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];
      currentBreadcrumbPath += `/${segment}`;
      breadcrumbs.push({
        name: segment,
        path: currentBreadcrumbPath
      });
    }
    
    return breadcrumbs;
  }
  
  // Function to get the display name for a breadcrumb
  function getBreadcrumbDisplay(crumb: { name: string, path: string }, index: number) {
    if (!isMobile || breadcrumbs.length <= 2) {
      return crumb.name;
    }
    
    // On mobile with more than 2 breadcrumbs
    if (index === 0) {
      // Always show the first segment as "..."
      return "...";
    } else if (index < breadcrumbs.length - 1) {
      // For middle segments, show "..." except for the last one
      return "...";
    } else {
      // For the last segment (current page), show the full name
      return crumb.name;
    }
  }

  let dirContent = [];
  let breadcrumbs = [];
  
  // Initialize and update when locale, posts, or path changes
  $: {
    currentLocale;
    posts;
    currentPath;
    dirContent = getCurrentDirContent();
    breadcrumbs = getBreadcrumbs();
  }
  
  // Check if we're in the posts directory
  $: isPostsDirectory = currentPath.includes(`/${currentLocale}/posts`) && !currentPath.split('/').slice(3).join('/');
  $: isRootDir = currentPath === `/${currentLocale}`;
</script>

<div class="file-explorer">
  <!-- URL/Path display -->
  <div class="url-display-container">
    <div class="url-display" bind:this={urlDisplayElement}>
      <span class="domain">md.gabrielolv.dev</span>
      {#each breadcrumbs as crumb, i}
        <span class="separator">/</span>
        <a 
          href={crumb.path}
          class="path-segment {i === breadcrumbs.length - 1 ? 'current' : ''}"
        >
          {getBreadcrumbDisplay(crumb, i)}
        </a>
      {/each}
      <span class="cursor">█</span>
    </div>
    <div class="language-toggle-container">
      <LanguageToggle />
    </div>
  </div>
  
  <!-- Directory content -->
  <div class="directory-content">
    {#if !isRootDir}
      <div class="directory-item go-up" role="button" tabindex="0" aria-label="Go up one level"
        on:click={goUp}
        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') goUp(); }}>
        <span class="item-icon"><ArrowUp size={18} /></span>
        <span class="item-name">..</span>
        <span class="item-description">Parent directory</span>
      </div>
    {/if}
    
    {#each dirContent as item}
      {#if isPostsDirectory && item.type === 'file' && item.metadata}
        <!-- Post Card Style for Posts Directory -->
        <div class="post-item" role="button" tabindex="0" aria-label={`Open ${item.name}`}
          on:click={() => navigateTo(item)}
          on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo(item); }}>
          <div class="post-header">
            <span class="item-icon">
              <FileText size={18} class="text-green-500" />
            </span>
            <span class="item-name">{item.name}</span>
            <span class="post-date">
              <Calendar size={14} class="mr-1" />
              {formatDate(new Date(item.metadata.date), $locale)}
            </span>
          </div>
          <div class="post-content">
            <h3 class="post-title">{item.metadata.title}</h3>
            <p class="post-excerpt">{item.metadata.excerpt}</p>
            
            {#if item.metadata.tags && item.metadata.tags.length > 0}
              <div class="post-tags">
                {#each item.metadata.tags as tag}
                  <span class="post-tag">{tag}</span>
                {/each}
              </div>
            {/if}
            
            <div class="post-footer">
              <span class="post-reading-time">
                {item.metadata.readingTime} {$t('common.minRead')}
              </span>
              <span class="post-read-more">{$t('common.readMore')} →</span>
            </div>
          </div>
        </div>
      {:else}
        <!-- Standard Directory Item -->
        <div class="directory-item" role="button" tabindex="0" aria-label={`Open ${item.name}`}
          on:click={() => navigateTo(item)}
          on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo(item); }}>
          <span class="item-icon">
            {#if item.icon}
              <svelte:component this={item.icon} size={18} />
            {:else}
              {#if item.type === 'directory'}
                <Folder size={18} />
              {:else}
                <FileText size={18} />
              {/if}
            {/if}
          </span>
          <span class="item-name">{item.name}{item.type === 'directory' ? '/' : ''}</span>
          <span class="item-description">{item.description || ''}</span>
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .file-explorer {
    margin-bottom: 1rem;
  }
  
  .url-display-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .url-display {
    padding: 8px 12px;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    white-space: nowrap;
    overflow-x: auto;
    display: flex;
    align-items: center;
    scrollbar-width: thin;
    scrollbar-color: rgba(76, 175, 80, 0.3) transparent;
    flex: 1;
  }
  
  .language-toggle-container {
    padding-right: 12px;
    display: flex;
    align-items: center;
  }
  
  /* Custom scrollbar styling */
  .url-display::-webkit-scrollbar {
    height: 4px;
  }
  
  .url-display::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .url-display::-webkit-scrollbar-thumb {
    background-color: rgba(76, 175, 80, 0.3);
    border-radius: 2px;
  }
  
  @media (min-width: 640px) {
    .url-display {
      padding: 12px 16px;
      font-size: 18px;
    }
    .file-explorer {
      margin-bottom: 1.5rem;
    }
  }
  
  .domain {
    color: #ffffff;
    font-weight: 600;
    margin-right: 2px;
  }
  
  .separator {
    color: rgba(255, 255, 255, 0.7);
    margin: 0 2px;
  }
  
  .path-segment {
    color: #ffffff;
    text-decoration: none;
    transition: color 0.2s;
    font-weight: 500;
  }
  
  .path-segment:hover {
    color: #4CAF50;
    text-decoration: underline;
  }
  
  .path-segment.current {
    color: #4CAF50;
    font-weight: 700;
  }
  
  .cursor {
    color: #4CAF50;
    animation: blink 1s step-end infinite;
    margin-left: 2px;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  
  .directory-content {
    list-style: none;
    padding: 0;
    margin: 0;
    box-shadow: 0 0 5px inset rgba(0, 0, 0, 0.25);
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .directory-item {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 10px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
    font-family: 'Fira Code', 'Courier New', monospace;
    color: #ffffff;
    font-weight: 500;
  }
  
  .directory-item.go-up {
    margin-bottom: 4px;
    padding-bottom: 12px;
    background: none;
    border: none;
    cursor: pointer;
    color: #4CAF50;
    display: flex;
    align-items: center;
  }
  
  .directory-item:hover {
    background-color: rgba(76, 175, 80, 0.1);
    border-left: 3px solid #4CAF50;
  }
  
  .item-icon {
    margin-right: 12px;
    font-size: 18px;
    width: 24px;
    text-align: center;
  }
  
  .item-name {
    font-family: 'Fira Code', 'Courier New', monospace;
    color: #ffffff;
    margin-right: 12px;
    font-weight: 500;
  }
  
  .item-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    margin-left: auto;
  }
  
  /* Post Item Styling */
  .post-item {
    display: flex;
    flex-direction: column;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .post-item:hover {
    background-color: rgba(76, 175, 80, 0.1);
    border-left: 3px solid #4CAF50;
  }
  
  .post-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .post-date {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin-left: auto;
  }
  
  .post-content {
    padding-left: 36px;
  }
  
  .post-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #ffffff;
  }
  
  .post-excerpt {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 12px 0;
    line-height: 1.5;
  }
  
  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .post-tag {
    font-size: 12px;
    background-color: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: 'Fira Code', 'Courier New', monospace;
  }
  
  .post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
  }
  
  .post-reading-time {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .post-read-more {
    color: #4CAF50;
    font-weight: 600;
  }
</style>
