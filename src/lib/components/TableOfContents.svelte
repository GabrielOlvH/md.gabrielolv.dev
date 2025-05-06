<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { writable, derived } from 'svelte/store';
  
  // Define the structure for TOC items
  interface TocItem {
    id: string;
    text: string;
    level: number;
    element: HTMLElement;
    parentId?: string; // Reference to parent heading
    sectionContext?: string; // Context from parent section for disambiguation
  }
  
  // Store for the TOC items
  const tocItems = writable<TocItem[]>([]);
  
  // Store for the active heading ID
  const activeId = writable<string | null>(null);
  
  // Derived store for expanded sections
  const expandedSections = derived(
    [tocItems, activeId],
    ([$tocItems, $activeId]) => {
      // Find all parent IDs that should be expanded
      const expandedIds = new Set<string>();
      
      // If there's an active heading, expand its parent and itself
      if ($activeId) {
        // Find the active item
        const activeItem = $tocItems.find(item => item.id === $activeId);
        if (activeItem) {
          // Add the active item
          expandedIds.add($activeId);
          
          // Add its parent if it has one
          if (activeItem.parentId) {
            expandedIds.add(activeItem.parentId);
            
            // Find the parent's parent (for h4 under h3 under h2)
            const parentItem = $tocItems.find(item => item.id === activeItem.parentId);
            if (parentItem && parentItem.parentId) {
              expandedIds.add(parentItem.parentId);
            }
          }
          
          // If this is an h2 or h3, expand its children
          if (activeItem.level <= 3) {
            $tocItems.forEach(item => {
              if (item.parentId === activeItem.id) {
                expandedIds.add(item.id);
              }
            });
          }
          
          // Also expand siblings of the active item for better context
          if (activeItem.parentId) {
            $tocItems.forEach(item => {
              if (item.parentId === activeItem.parentId) {
                expandedIds.add(item.id);
              }
            });
          }
          
          // For h2 headings, also expand the next h2's children if they exist
          if (activeItem.level === 2) {
            const h2Items = $tocItems.filter(item => item.level === 2);
            const currentIndex = h2Items.findIndex(item => item.id === activeItem.id);
            
            // If there's a next h2, expand its first few children
            if (currentIndex >= 0 && currentIndex < h2Items.length - 1) {
              const nextH2 = h2Items[currentIndex + 1];
              const nextH2Children = $tocItems.filter(item => item.parentId === nextH2.id);
              
              // Only expand the first 2 children of the next h2 for preview
              nextH2Children.slice(0, 2).forEach(child => {
                expandedIds.add(child.id);
              });
            }
          }
        }
      }
      
      return expandedIds;
    }
  );
  
  // Function to extract headings from the content
  function extractHeadings() {
    // Get all headings h2, h3, h4 from the article content
    const article = document.querySelector('article .prose');
    if (!article) return;
    
    const headings = Array.from(article.querySelectorAll('h2, h3, h4'));
    
    // Process each heading
    const items: TocItem[] = [];
    let lastH2: TocItem | null = null;
    let lastH3: TocItem | null = null;
    
    // Keep track of heading text counts for disambiguation
    const headingCounts = new Map<string, number>();
    
    headings.forEach((heading) => {
      const headingText = heading.textContent || '';
      
      // Count occurrences of this heading text
      const count = headingCounts.get(headingText) || 0;
      headingCounts.set(headingText, count + 1);
      
      // Create a unique ID for the heading
      let headingId = heading.id;
      
      // If the heading doesn't have an ID, generate one
      if (!headingId) {
        headingId = headingText.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
          
        // Add a suffix for duplicate headings
        if (count > 0) {
          headingId += `-${count}`;
        }
        
        heading.id = headingId;
      }
      
      const level = parseInt(heading.tagName.substring(1)); // Get the heading level (2 for h2, 3 for h3, etc.)
      
      // Determine section context for disambiguation in the TOC
      let sectionContext = '';
      if (level === 3 && lastH2) {
        sectionContext = lastH2.text;
      } else if (level === 4 && lastH3) {
        sectionContext = lastH3.text;
      }
      
      const item: TocItem = {
        id: headingId,
        text: headingText,
        level,
        element: heading as HTMLElement,
        sectionContext
      };
      
      // Set up parent-child relationships
      if (level === 2) {
        lastH2 = item;
        lastH3 = null;
      } else if (level === 3) {
        if (lastH2) {
          item.parentId = lastH2.id;
        }
        lastH3 = item;
      } else if (level === 4) {
        if (lastH3) {
          item.parentId = lastH3.id;
        } else if (lastH2) {
          item.parentId = lastH2.id;
        }
      }
      
      items.push(item);
    });
    
    tocItems.set(items);
  }
  
  // Function to update the active heading based on scroll position
  function updateActiveHeading() {
    if (typeof window === 'undefined') return;
    
    let $tocItems;
    tocItems.subscribe(value => { $tocItems = value; })();
    
    if (!$tocItems.length) return;
    
    // Get current scroll position
    const scrollY = window.scrollY;
    
    // Find the heading that is currently in view
    // We'll consider a heading "active" if it's at the top of the viewport or above it,
    // but closer to the top than any other heading
    let currentActive = null;
    let previousActive = $activeId;
    
    for (const item of $tocItems) {
      const { element } = item;
      const { offsetTop } = element;
      
      // Adjust this value to determine when a heading becomes active
      // The -100 offset means the heading becomes active slightly before it reaches the top
      if (offsetTop <= scrollY + 100) {
        currentActive = item.id;
      } else {
        // Once we've passed the current scroll position, we can stop
        break;
      }
    }
    
    // Only update if the active heading has changed
    if (currentActive !== previousActive) {
      activeId.set(currentActive);
      
      // Add a pulse effect to the newly active heading in the TOC
      if (currentActive) {
        setTimeout(() => {
          const activeLink = document.querySelector(`.toc-link[href="#${currentActive}"]`);
          if (activeLink) {
            activeLink.classList.add('pulse-effect');
            setTimeout(() => {
              activeLink.classList.remove('pulse-effect');
            }, 1000);
          }
        }, 50);
      }
    }
  }
  
  // Function to scroll to a heading when clicked
  function scrollToHeading(id: string) {
    const element = document.getElementById(id);
    if (!element) return;
    
    window.scrollTo({
      top: element.offsetTop - 80, // Adjust for any fixed headers
      behavior: 'smooth'
    });
    
    // Update the active heading
    activeId.set(id);
  }
  
  // Check if an item should be visible based on expanded sections
  function isVisible(item: TocItem, expandedIds: Set<string>) {
    // H2 headings are always visible
    if (item.level === 2) return true;
    
    // If it's an H3 or H4, check if its parent is expanded
    if (item.parentId && !expandedIds.has(item.parentId)) {
      return false;
    }
    
    return true;
  }
  
  // Format the display text for a TOC item, including context for disambiguation if needed
  function getDisplayText(item: TocItem) {
    // For h3 and h4 with duplicate names, show context
    if ((item.level === 3 || item.level === 4) && item.sectionContext) {
      // Check if there are duplicates of this heading text
      let $tocItems;
      tocItems.subscribe(value => { $tocItems = value; })();
      
      const duplicates = $tocItems.filter(
        i => i.text === item.text && i.id !== item.id && i.level === item.level
      );
      
      if (duplicates.length > 0) {
        return item.text; // Just return the text without context in parentheses
      }
    }
    
    return item.text;
  }
  
  // Initialize on mount
  onMount(() => {
    if (typeof window === 'undefined') return;

    extractHeadings();
    
    // Set up scroll event listener
    window.addEventListener('scroll', updateActiveHeading, { passive: true });
    
    // Initial update
    updateActiveHeading();
    
    return () => {
      // Clean up event listener on component destruction
      window.removeEventListener('scroll', updateActiveHeading);
    };
  });
  
  // Re-extract headings when content changes
  afterUpdate(() => {
    extractHeadings();
  });
</script>

<div class="toc-container">

  
  {#if $tocItems.length > 0}
    <nav class="toc-nav pr-2">
      <ul class="toc-list">
        {#each $tocItems as item}
          {#if isVisible(item, $expandedSections)}
            <li class="toc-item" style="">
              <div class="toc-item-wrapper" style="--indent-level: {item.level - 2};">
                <a 
                  href="#{item.id}" 
                  class="toc-link {$activeId === item.id ? 'active' : ''} {item.level > 2 ? 'child-link' : 'parent-link'}"
                  onclick|preventDefault={() => scrollToHeading(item.id)}
                  title={item.text + (item.sectionContext ? ` (${item.sectionContext})` : '')}
                >
                  {#if item.level > 2}
                    <span class="child-indicator">›</span>
                  {/if}
                  <span class="link-text">{getDisplayText(item)}</span>
                </a>
              </div>
            </li>
          {/if}
        {/each}
      </ul>
    </nav>
  {:else}
    <div class="toc-loading">
      <div class="toc-skeleton">
        <div class="skeleton-item"></div>
        <div class="skeleton-item"></div>
        <div class="skeleton-item skeleton-item-child"></div>
        <div class="skeleton-item skeleton-item-child"></div>
        <div class="skeleton-item"></div>
      </div>
    </div>
  {/if}
</div>

<style>
  .toc-container {
    position: sticky;
    top: 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    padding: 0.5rem 0;
    width: 14rem; /* Fixed width */
  }
  
  .toc-nav {
    width: 100%;
    font-size: 0.85rem;
  }
  
  .toc-list {
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .toc-item {
    width: 100%;
    margin-bottom: 0.25rem;

  }
  
  .toc-item-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  
  /* Fixed positioning for links */
  .toc-link {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: rgba(255, 255, 255, 0.7);
    transition: all 0.2s ease;
    padding: 0.25rem 0;
    margin-right: calc(var(--indent-level, 0) * 1rem);
    text-decoration: none;
  }
  
  .link-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 12rem;
  }
  
  .toc-link:hover {
    color: var(--color-primary);
  }
  
  .toc-link.active {
    color: var(--color-primary);
    font-weight: 500;
  }
  
  /* Parent/child differentiation */
  .parent-link {
    font-weight: 500;
  }

  .child-link {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
    animation: slideIn 0.3s ease-out;
  }
  
  .child-indicator {
    margin-right: 0.25rem;
    opacity: 0.7;
  }
  
  /* Animation for child headers */
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Enhanced active link styling */
  .toc-link.active::after {
    content: '';
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    background: var(--color-primary);
    animation: highlightGrow 0.3s ease-out forwards;
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.7);
    border-radius: 3px;
  }
  
  @keyframes highlightGrow {
    from {
      height: 0;
    }
    to {
      height: 75%;
    }
  }
  
  .toc-link.active.parent-link {
    text-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
    font-weight: 600;
    letter-spacing: 0.01em;
  }
  
  .toc-link.active.child-link {
    text-shadow: 0 0 5px rgba(76, 175, 80, 0.4);
    font-weight: 500;
  }
  
  /* Pulse effect for newly active links */
  .pulse-effect {
    animation: pulse 1s ease-out;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    20% {
      transform: scale(1.05);
    }
    40% {
      transform: scale(1);
    }
    60% {
      transform: scale(1.03);
    }
    80% {
      transform: scale(1);
    }
    100% {
      transform: scale(1);
    }
  }
  
  /* Add a subtle glow effect to active links */
  .toc-link.active::before {
    content: '';
    position: absolute;
    right: -2px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 70%;

    z-index: -1;
    animation: glowExpand 0.4s ease-out forwards;
  }
  
  @keyframes glowExpand {
    from {
      width: 0;
    }
    to {
      width: calc(100% + 10px);
    }
  }
  
  /* Scrollbar styling */
  .toc-container::-webkit-scrollbar {
    width: 2px;
  }
  
  .toc-container::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .toc-container::-webkit-scrollbar-thumb {
    background: rgba(76, 175, 80, 0.3);
  }
  
  /* For Firefox */
  .toc-container {
    scrollbar-width: thin;
    scrollbar-color: rgba(76, 175, 80, 0.3) transparent;
  }
  
  @media (max-width: 1024px) {
    .toc-container {
      position: relative;
      top: 0;
      margin-bottom: 1rem;
      max-height: none;
      width: 100%;
    }
    
    .toc-item-wrapper {
      justify-content: flex-start;
    }
    
    .toc-link {
      justify-content: flex-start;
      margin-left: calc(var(--indent-level, 0) * 0.75rem);
      margin-right: 0;
    }
  }
  
  .toc-loading {
    padding: 0.5rem 0;
  }
  
  .toc-skeleton {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .skeleton-item {
    height: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    width: 80%;
    animation: pulse-skeleton 1.5s infinite ease-in-out;
  }
  
  .skeleton-item-child {
    width: 70%;
    margin-left: 1rem;
    height: 0.8rem;
  }
  
  @keyframes pulse-skeleton {
    0% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0.3;
    }
  }
</style>
