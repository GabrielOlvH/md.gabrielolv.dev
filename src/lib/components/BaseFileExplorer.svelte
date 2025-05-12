<script module lang="ts">
  // Types/Interfaces exported here are available to other modules
  export interface ExplorerItem {
    name: string;
    type: 'directory' | 'file';
    icon?: any;
    description?: string;
    url?: string;
    external?: boolean;
    path?: string; 
    children?: Record<string, ExplorerItem>; 
  }
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowUp, ExternalLink as ExternalLinkIcon, Folder, FileText as DefaultFileTextIcon } from 'lucide-svelte'; 
  import { onMount } from 'svelte';

  // Using Svelte 5 Runes syntax for props
  let { 
    fileSystem, // Consider typing this more strictly, e.g., Record<string, ExplorerItem>
    currentPath,
    locale,
    onNavigate = (path: string) => goto(path), // Default value
    breadcrumbs = [], // Default value
    isProjectExplorer = false // Default value
  }: {
    fileSystem: any; // For now, keeping as any to avoid deeper type issues with initial structure
    currentPath: string;
    locale: string;
    onNavigate?: (path: string) => void; 
    breadcrumbs?: { name: string, path: string }[]; 
    isProjectExplorer?: boolean; 
  } = $props();

  let isMobile = false;
  let urlDisplayElement: HTMLElement;

  onMount(() => {
    isMobile = window.innerWidth < 640;
    const handleResize = () => {
      isMobile = window.innerWidth < 640;
    };
    window.addEventListener('resize', handleResize);
    if (urlDisplayElement) {
      urlDisplayElement.scrollLeft = urlDisplayElement.scrollWidth;
    }
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  function getCurrentDirContent(): ExplorerItem[] {
    const directEntry = fileSystem[currentPath] as ExplorerItem | undefined;
    if (directEntry && directEntry.type === 'directory' && directEntry.children) {
      return Object.entries(directEntry.children).map(([name, childInfo]): ExplorerItem => {
        
        const itemPath = childInfo.path || `${currentPath}/${name.replace(/\.md$/, '')}`; 
        return {
          name: childInfo.name || name, 
          type: childInfo.type || 'file', 
          icon: childInfo.icon,
          description: childInfo.description,
          url: childInfo.url,
          external: childInfo.external,
          path: itemPath,
          children: childInfo.children // This will also be Omit<ExplorerItem, 'name'> if passed down
        } as ExplorerItem;
      });
    }

    // 2. Fallback: Try navigating from the root ('/') for the main FileExplorer
    const pathWithoutLocale = currentPath.replace(`/${locale}`, '') || '/';
    const segments = pathWithoutLocale.split('/').filter(Boolean);
    let tempCurrent = fileSystem['/'] as ExplorerItem;
    if (!tempCurrent) return []; // Root not found

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (tempCurrent.type === 'directory' && tempCurrent.children && tempCurrent.children[segment]) {
        const childInfo = tempCurrent.children[segment];
        tempCurrent = { // Reconstruct the item for the next level
            name: segment, 
            type: childInfo.type,
            icon: childInfo.icon,
            description: childInfo.description,
            url: childInfo.url,
            external: childInfo.external,
            path: childInfo.path || (tempCurrent.path === '/' ? '/' : tempCurrent.path || '') + `/${segment}`,
            children: childInfo.children
        } as ExplorerItem;
      } else {
        return []; // Path segment not found or not a directory
      }
    }

    // If traversal succeeded, use the children of the final directory
    if (tempCurrent && tempCurrent.type === 'directory' && tempCurrent.children) {
      return Object.entries(tempCurrent.children).map(([name, info]): ExplorerItem => {
        const itemPath = info.path || `${tempCurrent.path === '/' ? '' : tempCurrent.path}/${name}`;
        return {
          name,
          ...(typeof info === 'object' && info !== null ? info : {}),
          type: info.type || 'file', 
          path: itemPath
        } as ExplorerItem;
      });
    }

    return []; // Return empty if neither direct path nor traversal worked
  }
  
  function getPathForItem(item: ExplorerItem): string | null {
    // 1. Trust explicit, internal URL if provided
    if (item.url && !item.external) {
      // Ensure it starts with the current locale? Or assume it's correct?
      // Let's assume item.url is correctly pre-formatted like /en/resume
      return item.url; 
    }

    // 2. Handle main directory navigation
    if (item.type === 'directory') {
      // These are the main sections defined in FileExplorer.svelte
      const mainSections = ['about', 'contact', 'projects', 'posts', 'resume']; // Add any others
      if (mainSections.includes(item.name)) {
        // Always construct path from locale and item name for these
        return `/${locale}/${item.name}`;
      }
      // Potentially handle nested directories here if needed, 
      // otherwise, they might not be navigable via this function
    }

    // 3. Not navigable via this function
    return null; 
  }

  function handleClick(item: ExplorerItem) {
    const targetPath = getPathForItem(item);
    
    if (targetPath) {
      // Use the reliably calculated path
      onNavigate(targetPath);
    } else if (item.url && item.external) {
      // Handle external links
      window.open(item.url, '_blank');
    } 
    // Decide what happens if it's not external and not a main directory - currently nothing.
    // Maybe it should navigate based on item.path if that exists?
    // else if (item.path) { onNavigate(item.path); } // Add if needed
  }
  
  function getBreadcrumbDisplay(crumb: { name: string, path: string }, index: number) {
    if (!isMobile || breadcrumbs.length <= 2) {
      return crumb.name;
    }
    if (index === 0) {
      return "...";
    } else if (index < breadcrumbs.length - 1) {
      return "...";
    } else {
      return crumb.name;
    }
  }
</script>

<div class="file-explorer">
  <div class="url-display-container">
    <div class="url-display" bind:this={urlDisplayElement}>
      <span class="domain">md.gabrielolv.dev</span>
      {#each breadcrumbs as crumb, i (i)}
        <span class="sep">/</span>
        <button class="breadcrumb {i === breadcrumbs.length - 1 ? 'current' : ''}" onclick={() => onNavigate(crumb.path)}>
          {getBreadcrumbDisplay(crumb, i)}
        </button>
      {/each}
    </div>
    <div class="language-toggle-container">
      <slot></slot>
    </div>
  </div>

  <slot name="header-controls"></slot>

  <div class="directory-content">
    {#if breadcrumbs.length > 1} 
      <div class="directory-item go-up" role="button" tabindex="0" aria-label="Go up one level"
        onclick={() => onNavigate(breadcrumbs[breadcrumbs.length-2].path)}
        onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate(breadcrumbs[breadcrumbs.length-2].path); }}>
        <span class="item-icon"><ArrowUp size={18} /></span>
        <div class="item-text-content"> 
            <span class="item-name">..</span>
            <span class="item-description">Parent directory</span>
        </div>
      </div>
    {/if}
    {#each getCurrentDirContent() as item (item.path ?? item.name)}
      {@const targetPath = getPathForItem(item)}

      {#if targetPath && !item.external}
        <a href={targetPath}
           class="directory-item {item.type}"
           role="link"
           aria-label={`Navigate to ${item.name}`}
           data-sveltekit-preload-data="hover"
           onclick={(e) => { e.preventDefault(); handleClick(item); }}>
          <span class="item-icon">
            {#if item.icon}
              <svelte:component this={item.icon} />
            {:else if item.type === 'directory'}
              <Folder size={18} />
            {:else}
              <DefaultFileTextIcon size={18} />
            {/if}
            {#if item.external}
              <ExternalLinkIcon size={14} class="external-link-indicator" />
            {/if}
          </span>
          <div class="item-text-content">
            <span class="item-name">{item.name}{item.type === 'directory' && !isProjectExplorer ? '/' : ''}</span>
            {#if item.description}
              <span class="item-description">{item.description}</span>
            {/if}
          </div>
        </a>
      {:else if item.url && item.external}
        <a href={item.url}
           target="_blank"
           rel="noopener noreferrer"
           class="directory-item {item.type}"
           role="link"
           aria-label={`Open ${item.name} (external link)`}>
          <span class="item-icon">
            {#if item.icon}
              <svelte:component this={item.icon} />
            {:else if item.type === 'directory'}
              <Folder size={18} />
            {:else}
              <DefaultFileTextIcon size={18} />
            {/if}
            <ExternalLinkIcon size={14} class="external-link-indicator" />
          </span>
          <div class="item-text-content">
            <span class="item-name">{item.name}</span>
            {#if item.description}
              <span class="item-description">{item.description}</span>
            {/if}
          </div>
        </a>
      {:else}
        <div class="directory-item {item.type} non-navigable"
             role="button" tabindex="0" aria-label={`Open ${item.name}`}
             onclick={() => handleClick(item)}
             onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(item); }}>
          <span class="item-icon">
            {#if item.icon}
              <svelte:component this={item.icon} />
            {:else if item.type === 'directory'}
              <Folder size={18} />
            {:else}
              <DefaultFileTextIcon size={18} />
            {/if}
            {#if item.external}
              <ExternalLinkIcon size={14} class="external-link-indicator" />
            {/if}
          </span>
          <div class="item-text-content">
            <span class="item-name">{item.name}{item.type === 'directory' && !isProjectExplorer ? '/' : ''}</span>
            {#if item.description}
              <span class="item-description">{item.description}</span>
            {/if}
          </div>
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
    align-items: flex-start;
    padding: 0.6rem 0.75rem;
    margin-bottom: 0.1rem;
    border-radius: 0.375rem;
    transition: background-color 0.15s ease-out;
    cursor: pointer;
  }
  .directory-item:hover {
    background-color: rgba(55, 65, 81, 0.25);
  }
  .directory-item.go-up:hover .item-name,
  .directory-item.file:hover .item-name, 
  .directory-item.directory:hover .item-name {
      color: #34d399;
  }

  .item-icon {
    margin-right: 0.85rem;
    margin-top: 0.2rem;
    flex-shrink: 0;
    color: #a0aec0;
    display: flex;
    align-items: center;
  }

  .item-text-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0;
  }

  .item-name {
    font-weight: 500;
    color: #e5e7eb;
    line-height: 1.45;
    transition: color 0.15s ease-out;
  }

  .item-description {
    font-size: 0.875rem;
    color: #9ca3af;
    line-height: 1.5;
    margin-top: 0.1rem;
  }

  .external-link-indicator {
    margin-left: 0.5rem;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  /* Remove unused selector 
  .directory-item:hover .external-link-indicator {
    opacity: 1;
  }
  */

  /* Add any necessary styles for your application */
</style>
