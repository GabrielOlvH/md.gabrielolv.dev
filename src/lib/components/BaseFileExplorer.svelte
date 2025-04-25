<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowUp } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import type { SvelteComponent } from 'svelte';

  export let fileSystem: any;
  export let currentPath: string;
  export let locale: string;
  export let onNavigate: (path: string) => void = (path) => goto(path);
  export let breadcrumbs: { name: string, path: string }[] = [];

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

    // Traverse directories
    for (const segment of segments) {
      if (current.children && current.children[segment]) {
        current = current.children[segment];
      } else {
        return [];
      }
    }
    if (current.type === 'directory') {
      return Object.entries(current.children || {}).map(([name, info]) => ({
        name,
        ...info
      }));
    }
    return [];
  }

  function handleClick(item: any) {
    if (item.type === 'directory') {
      onNavigate(item.path || `${currentPath}/${item.name}`);
    } else if (item.type === 'file' && item.url) {
      onNavigate(item.url);
    }
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
</script>

<div class="file-explorer">
  <!-- URL/Path display -->
  <div class="url-display-container">
    <div class="url-display" bind:this={urlDisplayElement}>
      <span class="domain">md.gabrielolv.dev</span>
      {#each breadcrumbs as crumb, i}
        <span class="sep">/</span>
        <span class="breadcrumb {i === breadcrumbs.length - 1 ? 'current' : ''}" on:click={() => onNavigate(crumb.path)}>
          {getBreadcrumbDisplay(crumb, i)}
        </span>
      {/each}
    </div>
    <div class="language-toggle-container">
      <slot></slot>
    </div>
  </div>

  <!-- Directory content -->
  <div class="directory-content">
    {#if breadcrumbs.length > 1}
      <div class="directory-item go-up" role="button" tabindex="0" aria-label="Go up one level"
        on:click={() => onNavigate(breadcrumbs[breadcrumbs.length-2].path)}
        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate(breadcrumbs[breadcrumbs.length-2].path); }}>
        <span class="item-icon"><ArrowUp size={18} /></span>
        <span class="item-name">..</span>
        <span class="item-description">Parent directory</span>
      </div>
    {/if}
    {#each getCurrentDirContent() as item}
      <div class="directory-item {item.type}" role="button" tabindex="0" aria-label={`Open ${item.name}`}
        on:click={() => handleClick(item)}
        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(item); }}>
        <span class="item-icon">
          {#if item.icon}
            <svelte:component this={item.icon as typeof SvelteComponent} size={18} />
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
  .sep, .separator {
    color: rgba(255, 255, 255, 0.7);
    margin: 0 2px;
  }
  .breadcrumb, .path-segment {
    color: #ffffff;
    text-decoration: none;
    transition: color 0.2s;
    font-weight: 500;
    cursor: pointer;
  }
  .breadcrumb:hover, .path-segment:hover {
    color: #4CAF50;
    text-decoration: underline;
  }
  .breadcrumb.current, .path-segment.current {
    color: #4CAF50;
    font-weight: 700;
  }
  .up-btn, .go-up {
    margin-bottom: 4px;
    padding-bottom: 12px;
    background: none;
    border: none;
    cursor: pointer;
    color: #4CAF50;
    display: flex;
    align-items: center;
  }
  .file-list, .directory-content {
    list-style: none;
    padding: 0;
    margin: 0;
    box-shadow: 0 0 5px inset rgba(0, 0, 0, 0.25);
    background-color: rgba(0, 0, 0, 0.05);
  }
  .file-item, .directory-item {
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
  .file-item.directory, .directory-item.directory {
    font-weight: bold;
  }
  .file-item:hover, .directory-item:hover {
    background-color: rgba(76, 175, 80, 0.1);
    border-left: 3px solid #4CAF50;
  }
  .item-icon {
    margin-right: 12px;
    font-size: 18px;
    width: 24px;
    text-align: center;
  }
  .file-name, .item-name {
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
