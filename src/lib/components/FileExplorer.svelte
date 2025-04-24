<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Folder, FileText, ArrowUp, User, FilePen, Mail } from 'lucide-svelte';

  // Current path from URL including locale
  $: currentPath = $page.url.pathname;
  $: locale = $page.params.locale;

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
  
  // Get current directory content
  function getCurrentDirContent() {
    // Remove locale from path for directory lookup
    const pathWithoutLocale = currentPath.replace(`/${locale}`, '') || '/';
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
      window.open(path.url, '_blank');
      return;
    }
    
    // Get path without locale
    const pathWithoutLocale = currentPath.replace(`/${locale}`, '') || '/';
    
    // Otherwise navigate to the directory
    const newPath = pathWithoutLocale === '/' 
      ? `/${path.name}` 
      : `${pathWithoutLocale}/${path.name}`;
    
    goto(`/${locale}${newPath}`);
  }
  
  // Go up one level
  function goUp() {
    // Get path without locale
    const pathWithoutLocale = currentPath.replace(`/${locale}`, '') || '/';
    const segments = pathWithoutLocale.split('/').filter(segment => segment.length > 0);
    
    if (segments.length === 0) return;
    
    segments.pop();
    const newPath = segments.length === 0 ? '' : '/' + segments.join('/');
    goto(`/${locale}${newPath}`);
  }
  
  // Get breadcrumb segments
  function getBreadcrumbs() {
    const breadcrumbs = [{ name: locale, path: `/${locale}` }];
    
    // Get segments including the locale
    const segments = currentPath.split('/').filter(segment => segment.length > 0);
    
    let currentBreadcrumbPath = `/${locale}`;
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

  $: dirContent = getCurrentDirContent();
  $: breadcrumbs = getBreadcrumbs();
  $: isRootDir = currentPath === `/${locale}`;
</script>

<div class="file-explorer">
  <!-- URL/Path display -->
  <div class="url-display">
    <span class="domain">md.gabrielolv.dev</span>
    {#each breadcrumbs as crumb, i}
      <span class="separator">/</span>
      <a 
        href={crumb.path}
        class="path-segment {i === breadcrumbs.length - 1 ? 'current' : ''}"
      >
        {crumb.name}
      </a>
    {/each}
    <span class="cursor">█</span>
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
    {/each}
  </div>
</div>

<style>
  .file-explorer {
    margin-bottom: 1.5rem;
  }
  
  .url-display {
    padding: 12px 16px;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.9);
    white-space: nowrap;
    overflow-x: auto;
    display: flex;
    align-items: center;

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
    display: inline-block;
    color: rgba(255, 255, 255, 0.9);
    margin-left: 4px;
    animation: blink 1s step-end infinite;
  }
  
  @keyframes blink {
    50% { opacity: 0; }
  }
  
  .directory-content {
    padding: 8px 0;
    box-shadow: 0 0 5px inset rgba(0, 0, 0, 0.25);
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .directory-item {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
  }
  
  .directory-item:hover {
    background-color: rgba(76, 175, 80, 0.1);
    border-left: 3px solid #4CAF50;
  }
  
  .go-up {
    margin-bottom: 4px;
    padding-bottom: 12px;
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
</style>
