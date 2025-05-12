<script lang="ts">
  import { page } from '$app/state';
  import ProjectsFileExplorer from '$lib/components/ProjectsFileExplorer.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import { t } from '$lib/i18n/translations';
  

</script>

<SEO
  title={`${$t('projects.title')} | Gabriel's Blog`}
  description={$t('projects.subtitle')}
  type="website"
  canonical={`https://md.gabrielolv.dev/${page.params.locale}/projects`}
/>

<main class="min-h-screen flex items-center sm:py-10">
  <div class="relative max-w-4xl mx-auto sm:px-8">
    <div class="content-container rounded-lg shadow-xl p-0 sm:p-0">
      <ProjectsFileExplorer />
      
      <footer class="mt-8 pt-6 border-t border-green-800/50 text-center text-gray-400 text-sm px-6 sm:px-8 pb-6 sm:pb-8">
        <p>{$t('common.footer', { year: new Date().getFullYear().toString() })}</p>
      </footer>
    </div>
  </div>
</main>

<style>
  .content-container {
    background-color: rgba(17, 24, 39, 0.9); 
    backdrop-filter: blur(14px); 
    border: 1px solid rgba(55, 65, 81, 0.5); 
  }

  :global(html) {
    scroll-behavior: smooth;
  }
</style>
