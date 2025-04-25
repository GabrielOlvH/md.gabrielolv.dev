<script lang="ts">
  import { t } from '$lib/i18n/translations';
  import { page } from '$app/state';
  import SEO from '$lib/components/SEO.svelte';
  import FileExplorer from '$lib/components/FileExplorer.svelte';
  import { Code, ExternalLink } from 'lucide-svelte';
  
  // Project categories
  const categories = [
    { id: 'minecraft', name: 'Minecraft Mods' },
    { id: 'games', name: 'Games' },
    { id: 'tools', name: 'Tools & Libraries' },
    { id: 'websites', name: 'Websites' }
  ];
  
  // Get projects from translations
  $: projects = [
    {
      id: 'industrial_revolution',
      name: $t('projects.industrial_revolution.title'),
      description: $t('projects.industrial_revolution.desc'),
      category: 'minecraft',
      image: '/images/projects/industrial-revolution.jpg',
      url: 'https://github.com/GabrielOlvH/Industrial-Revolution'
    },
    {
      id: 'minecraft_mods',
      name: $t('projects.multiple_minecraft_mods.title'),
      description: $t('projects.multiple_minecraft_mods.desc'),
      category: 'minecraft',
      image: '/images/projects/minecraft-mods.jpg',
      url: 'https://github.com/GabrielOlvH'
    },
    {
      id: 'castor_odyssey',
      name: $t('projects.the_castor_odyssey.title'),
      description: $t('projects.the_castor_odyssey.desc'),
      category: 'games',
      image: '/images/projects/castor-odyssey.jpg'
    },
    {
      id: 'pokemon_tcg_replay',
      name: $t('projects.pokemon_tcg_replay.title'),
      description: $t('projects.pokemon_tcg_replay.desc'),
      category: 'games',
      image: '/images/projects/pokemon-tcg.jpg'
    },
    {
      id: 'cafeteria_website',
      name: $t('projects.cafeteria_development_website.title'),
      description: $t('projects.cafeteria_development_website.desc'),
      category: 'websites',
      image: '/images/projects/cafeteria-dev.jpg',
      url: 'https://cafeteriadev.com'
    },
    {
      id: 'text_editor',
      name: $t('projects.simple_text_editor.title'),
      description: $t('projects.simple_text_editor.desc'),
      category: 'tools',
      image: '/images/projects/text-editor.jpg',
      url: 'https://github.com/GabrielOlvH/SimpleTextEditor'
    }
  ];
  
  // Active category filter
  let activeCategory = 'all';
  
  // Filtered projects
  $: filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);
</script>

<SEO 
  title={`${$t('projects.title')} | Gabriel's Blog`}
  description={$t('projects.subtitle')}
  type="website"
  canonical={`https://md.gabrielolv.dev/${page.params.locale}/projects`}
/>

<main class="min-h-screen sm:py-10">

  <div class="relative max-w-3xl mx-auto sm:px-8">
    <!-- Main content (centered) -->
    <div class="content-container rounded-lg shadow-md p-6 sm:p-8">
      <!-- File Explorer Navigation -->
      <FileExplorer />
      
      <!-- README Content -->
      <article>
        <div class="readme-header">
          <h1 class="text-3xl font-bold mb-4 text-white flex items-center gap-2">
            <Code class="h-6 w-6 text-green-500" />
            {$t('projects.title')}
          </h1>
          <div class="text-gray-400 text-sm mb-6">Last updated: {new Date().toLocaleDateString()}</div>
        </div>
        
        <div class="prose prose-invert prose-green max-w-none">
          <p class="text-gray-300 mb-8">{$t('projects.intro')}</p>
          
          <!-- Category filters -->
          <div class="flex flex-wrap gap-2 mb-8">
            <button 
              class={`px-3 py-1 rounded-full text-sm transition-colors ${activeCategory === 'all' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              on:click={() => activeCategory = 'all'}
            >
              All
            </button>
            {#each categories as category (category)}
              <button 
                class={`px-3 py-1 rounded-full text-sm transition-colors ${activeCategory === category.id ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                on:click={() => activeCategory = category.id}
              >
                {category.name}
              </button>
            {/each}
          </div>
          
          <!-- Projects grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {#each filteredProjects as project (project)}
              <div class="project-card bg-gray-800/60 border border-green-800/30 rounded-lg overflow-hidden hover:border-green-600/50 transition-colors">
                <div class="project-image h-40 bg-gray-700 relative">
                  <!-- Placeholder for project image -->
                  <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                    <span class="text-2xl font-bold text-gray-500">{project.name.charAt(0)}</span>
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="text-lg font-semibold text-white mb-2">{project.name}</h3>
                  <p class="text-gray-300 text-sm mb-4">{project.description}</p>
                  <div class="flex justify-between items-center">
                    <span class="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                      {categories.find(c => c.id === project.category)?.name || 'Other'}
                    </span>
                    {#if project.url}
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="text-green-500 hover:text-green-400 flex items-center gap-1 text-sm"
                      >
                        View Project <ExternalLink class="h-3 w-3" />
                      </a>
                    {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
          
          <div class="info-box bg-gray-800/40 border border-green-800/30 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-2">{$t('projects.more_info')}</h3>
            <p class="text-gray-300">{$t('projects.github_info')}</p>
            <a 
              href="https://github.com/GabrielOlvH" 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 mt-2 text-green-500 hover:text-green-400"
            >
              GitHub Profile <ExternalLink class="h-3 w-3" />
            </a>
          </div>
        </div>
      </article>
    </div>
  </div>
</main>

<style>
  .readme-header {
    border-bottom: 1px solid rgba(76, 175, 80, 0.3);
    margin-bottom: 2rem;
    padding-bottom: 1rem;
  }

  .content-container {
    background-color: rgba(22, 27, 34, 0.95);
    box-shadow: 0 4px 20px 0 rgba(76, 175, 80, 0.2);
    border: 1px solid rgba(76, 175, 80, 0.1);
  }

  .project-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }

  .project-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  }

  /* Smooth scrolling for anchor links */
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
