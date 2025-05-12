<script context="module" lang="ts">
  // Types/Interfaces exported here are available to other modules
  export interface ExplorerItem {
    name: string;
    type: 'directory' | 'file';
    icon?: any; // Consider a more specific Svelte component type
    description?: string;
    url?: string;
    external?: boolean;
    path?: string; 
    children?: Record<string, Omit<ExplorerItem, 'name'>>; // For directory children
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
    const pathWithoutLocale = currentPath.replace(`/${locale}`, '') || '/';
    let currentDirData: ExplorerItem | undefined;

    // Navigate the fileSystem to find the current directory's data
    const segments = pathWithoutLocale.split('/').filter(Boolean);
    let tempCurrent = fileSystem['/'] as ExplorerItem;
    if (!tempCurrent) return []; // Root not found

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (tempCurrent.type === 'directory' && tempCurrent.children && tempCurrent.children[segment]) {
        // Create a full item for the next level before assigning to tempCurrent
        const childInfo = tempCurrent.children[segment];
        tempCurrent = {
            name: segment, 
            type: childInfo.type,
            icon: childInfo.icon,
            description: childInfo.description,
            url: childInfo.url,
            external: childInfo.external,
            path: childInfo.path || (tempCurrent.path ? `${tempCurrent.path}/${segment}` : `/${segment}`),
            children: childInfo.children
        } as ExplorerItem;
      } else {
        return []; // Path segment not found or not a directory
      }
    }
    currentDirData = tempCurrent;

    if (currentDirData && currentDirData.type === 'directory' && currentDirData.children) {
      return Object.entries(currentDirData.children).map(([name, info]): ExplorerItem => {
        const itemPath = info.path || `${currentDirData!.path === '/' ? '' : currentDirData!.path}/${name}`;
        return {
          name,
          type: info.type,
          icon: info.icon,
          description: info.description,
          url: info.url,
          external: info.external,
          path: itemPath,
          children: info.children
        } as ExplorerItem;
      });
    }
    return [];
  }
  
  function getPathForItem(item: ExplorerItem): string | null {
    if (item.url && !item.external) return item.url;
    if (item.type === 'directory') {
      // Ensure path is absolute and starts with locale if not already included
      let path = item.path || (currentPath === `/${locale}` ? `/${locale}/${item.name}` : `${currentPath}/${item.name}`);
      if (!path.startsWith(`/${locale}`)) {
        path = `/${locale}${path.startsWith('/') ? '' : '/'}${path}`;
      }
       // Normalize: remove locale prefix if currentPath already has it for relative construction
      const baseCurrentPath = currentPath.startsWith(`/${locale}/`) ? currentPath.substring(locale.length + 1) : currentPath;
      let constructedPath = item.path;
      if (!constructedPath) {
          if(baseCurrentPath === '/' || baseCurrentPath === '' || !baseCurrentPath.substring(1).includes(item.name.split('/')[0])){
            constructedPath = `/${locale}/${item.name}`;
          } else {
            constructedPath = `/${locale}${baseCurrentPath}/${item.name}`;
          }
      }
      
      // Ensure the path for directories like 'about', 'posts' is /locale/item.name
      if (!item.url && (item.name === 'about' || item.name === 'contact' || item.name === 'projects' || item.name === 'posts')) {
        return `/${locale}/${item.name}`;
      }
      return constructedPath;
    }
    return item.url || null; // Return explicit URL for files if available
  }

  function handleClick(item: ExplorerItem) {
    if (item.type === 'directory') {
      onNavigate(item.path || `${currentPath}/${item.name}`);
    } else if (item.type === 'file' && item.url) {
      if (item.external) {
        window.open(item.url, '_blank');
      } else {
        onNavigate(item.url);
      }
    }
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
    {#each getCurrentDirContent() as item (item.name)}
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
