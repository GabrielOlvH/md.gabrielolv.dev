<script lang="ts">
  import { page } from '$app/stores';
  import DynamicTitle from './DynamicTitle.svelte';

  export let title: string = "Gabriel's Tech Blog";
  export let description: string = "Exploring computer science, web development, and my personal coding journey";
  export let type: string = "website";
  export let image: string = "/images/og-image.jpg"; // Default OG image
  export let publishedTime: string | null = null;
  export let modifiedTime: string | null = null;
  export let tags: string[] = [];
  export let canonical: string | null = null;
  export let usePathAsTitle: boolean = false;
  
  // Compute the canonical URL if not provided
  $: computedCanonical = canonical || `https://md.gabrielolv.dev${$page.url.pathname}`;
  
  // Compute the absolute image URL
  $: absoluteImageUrl = image.startsWith('http') ? image : `https://md.gabrielolv.dev${image}`;
</script>

{#if usePathAsTitle}
  <DynamicTitle />
{:else}
  <DynamicTitle customTitle={title} />
{/if}

<svelte:head>
  <!-- Basic Meta Tags -->
  <meta name="description" content={description} />
  
  <!-- Canonical URL -->
  <link rel="canonical" href={computedCanonical} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:url" content={computedCanonical} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={absoluteImageUrl} />
  <meta property="og:locale" content={$page.params.locale || 'en'} />
  <meta property="og:site_name" content="md.gabrielolv.dev" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content={computedCanonical} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={absoluteImageUrl} />
  
  <!-- Article specific tags (for blog posts) -->
  {#if type === 'article' && publishedTime}
    <meta property="article:published_time" content={publishedTime} />
  {/if}
  
  {#if type === 'article' && modifiedTime}
    <meta property="article:modified_time" content={modifiedTime} />
  {/if}
  
  {#if type === 'article' && tags.length > 0}
    {#each tags as tag (tag)}
      <meta property="article:tag" content={tag} />
    {/each}
  {/if}
  
  <!-- Additional SEO tags -->
  <meta name="robots" content="index, follow" />
  <meta name="author" content="Gabriel Olv" />
</svelte:head>
