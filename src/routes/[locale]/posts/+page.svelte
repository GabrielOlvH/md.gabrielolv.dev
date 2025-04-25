<script lang="ts">
  import { locale, t } from '$lib/i18n/translations';
  import { page } from '$app/state';
  import SEO from '$lib/components/SEO.svelte';
  import PostsFileExplorer from '$lib/components/PostsFileExplorer.svelte';
  import { getAllPosts } from '$lib/utils/posts';

  const posts = $derived(getAllPosts($locale));

</script>

<SEO
  title={`${$t('nav.posts')} | Gabriel's Blog`}
  description="Explore my latest articles about web development, programming, and technology"
  type="website"
  canonical={`https://md.gabrielolv.dev/${page.params.locale}/posts`}
/>

<main class="min-h-screen sm:py-10">
  <div class="max-w-3xl mx-auto sm:px-8">
    <div class="content-container rounded-lg shadow-md p-6 sm:p-8">

      <PostsFileExplorer {posts} />

      <footer class="mt-16 pt-6 border-t border-green-800/50 text-center text-gray-400 text-sm">
        <p>{$t('common.footer', { year: new Date().getFullYear().toString() })}</p>
      </footer>
    </div>
  </div>
</main>

<style>
  /* Add any specific styles for the posts page here */
</style>
