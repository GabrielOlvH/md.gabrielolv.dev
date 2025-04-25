<script lang="ts">
  import type { TocItem } from '$lib/utils/markdown';
  import TableOfContents from './TableOfContents.svelte';
  import { ListCollapse } from 'lucide-svelte';
  import { onMount } from 'svelte';
  export let items: TocItem[]

  let isDesktop = false;

  function checkDesktop() {
    isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  }

  onMount(() => {
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  });
</script>

{#if isDesktop}
  <!-- Desktop sidebar version -->
  <div class="hidden lg:block absolute right-full top-0 pr-8 w-64">
    <div class="fixed">
      <TableOfContents {items} />
    </div>
  </div>
{:else}
  <!-- Mobile floating button version -->
  <div class="lg:hidden toc-floating-container">
    <details class="toc-floating">
      <summary class="toc-floating-button">
        <ListCollapse class="text-emerald-200" />
      </summary>
      <div class="toc-floating-content">
        <TableOfContents {items} />
      </div>
    </details>
  </div>
{/if}

<style>
  .toc-floating-container {
    position: fixed;
    left: 0;
    top: 2em;
    transform: none;
    z-index: 50;
  }
  .toc-floating {
    position: relative;
  }
  .toc-floating-button {
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 0 4px 0px 0;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .toc-floating-content {
    position: absolute;
    left: 0;
    top: 39px;
    background: rgba(0, 0, 0, 0.5);
    max-height: 80vh;
    overflow-y: auto;
    backdrop-filter: blur(10px);
    border-radius: 0 1rem 1rem 0;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    padding: 1rem;
  }
  details[open] .toc-floating-content {
    transform: translateX(0px);
  }
  .toc-floating summary::-webkit-details-marker {
    display: none;
  }
  .toc-floating summary {
    list-style: none;
  }
</style>
