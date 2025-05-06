<script lang="ts">
  import { page } from '$app/state';
  import ProjectsFileExplorer from '$lib/components/ProjectsFileExplorer.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import { t } from '$lib/i18n/translations';
  import { derived } from 'svelte/store';

  const filteredProjects = derived(
    [t],
    ([$_t,]) => {

      return [
        {
          id: 'kaia',
          name: $_t('projects.kaia.title'),
          description: $_t('projects.kaia.desc'),
          category: 'tools',
          url: 'https://github.com/GabrielOlvH/Kaia'
        },
        {
          id: 'blog',
          name: $_t('projects.blog.title'),
          description: $_t('projects.blog.desc'),
          category: 'websites',
          url: 'https://github.com/GabrielOlvH/md.gabrielolv.dev'
        },
        {
          id: 'cafeteria_website',
          name: $_t('projects.cafeteria_development_website.title'),
          description: $_t('projects.cafeteria_development_website.desc'),
          category: 'websites',
          url: 'https://cafeteria.dev'
        },
        {
          id: 'industrial_revolution',
          name: $_t('projects.industrial_revolution.title'),
          description: $_t('projects.industrial_revolution.desc'),
          category: 'minecraft',
          url: 'https://github.com/GabrielOlvH/Industrial-Revolution'
        },
        {
          id: 'multiple_minecraft_mods',
          name: $_t('projects.multiple_minecraft_mods.title'),
          description: $_t('projects.multiple_minecraft_mods.desc'),
          category: 'minecraft',
          url: 'https://modrinth.com/user/GabrielOlvH'
        },
        {
          id: 'castor_odyssey',
          name: $_t('projects.castor_odyssey.title'),
          description: $_t('projects.castor_odyssey.desc'),
          category: 'games',
          url: 'https://gabrielolvh.itch.io/castors-odyssey'
        },
        {
          id: 'pokemon_tcg_replay',
          name: $_t('projects.pokemon_tcg_replay.title'),
          description: $_t('projects.pokemon_tcg_replay.desc'),
          category: 'games',
          url: 'https://github.com/GabrielOlvH/TCGReplay'
        },
      ]
    }
  );

</script>

<SEO
  title={`${$t('projects.title')} | Gabriel's Blog`}
  description={$t('projects.subtitle')}
  type="website"
  canonical={`https://md.gabrielolv.dev/${page.params.locale}/projects`}
/>

<main class="min-h-screen sm:py-10">
  <div class="relative max-w-4xl mx-auto sm:px-8">
    <div class="content-container rounded-lg shadow-xl p-0 sm:p-0">
      <ProjectsFileExplorer 
        projects={$filteredProjects} 
      />
      
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
