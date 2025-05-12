<script lang="ts">
  import { t } from '$lib/i18n/translations';
  import { page } from '$app/state';
  import SEO from '$lib/components/SEO.svelte';
  import FileExplorer from '$lib/components/FileExplorer.svelte';
  import { User, Wrench, Gamepad2 } from 'lucide-svelte';

  const skills = [
    { name: 'Kotlin', color: '#F7DF1E' },
    { name: 'Java', color: '#F7DF1E' },
    { name: 'PHP', color: '#F7DF1E' },
    { name: 'C#', color: '#4479A1' },
    { name: 'JavaScript', color: '#F7DF1E' },
    { name: 'TypeScript', color: '#3178C6' },
    { name: 'React', color: '#61DAFB' },
    { name: 'Svelte', color: '#FF3E00' },
    { name: 'Node.js', color: '#339933' },
    { name: 'HTML/CSS', color: '#E34F26' },
    { name: 'Python', color: '#3776AB' },
    { name: 'SQL & NoSQL', color: '#4479A1' },
    { name: 'Git', color: '#F05032' },
    { name: 'Docker', color: '#2496ED' },
    { name: 'RabbitMQ', color: '#FCC624' },
    { name: 'Unity', color: '#100000' },
  ];

</script>

<SEO 
  title={`${$t('about.title')} | Gabriel's Blog`}
  description={$t('about.subtitle')}
  type="website"
  canonical={`https://md.gabrielolv.dev/${page.params.locale}/about`}
/>

<main class="min-h-screen sm:py-10">

  <div class="relative max-w-3xl mx-auto sm:px-8">
    
    <div class="content-container rounded-lg shadow-md p-6 sm:p-8">
      <FileExplorer />
      
      <article>
        <div class="readme-header">
          <h1 class="text-3xl font-bold mb-4 text-white">README.md</h1>
          <div class="text-gray-400 text-sm mb-6">Last updated: {new Date().toLocaleDateString()}</div>
        </div>
        
        <div class="prose prose-invert prose-green max-w-none">
          <h2 id="about-me" class="flex items-center gap-2">
            <User class="h-5 w-5 text-green-500" />
            {$t('about.title')}
          </h2>
          
          <div class="flex flex-col md:flex-row items-center gap-8 ">

            <img src="/profile.jpg" alt="My profile" class="w-48 h-48 rounded-full object-cover" />

            <div class="flex-1">
              <p>
                {$t('about.intro')}
              </p>

              <p>
                {$t('about.bio')}
              </p>
            </div>
          </div>
          
          <h2 id="skills" class="flex items-center gap-2">
            <Wrench class="h-5 w-5 text-green-500" />
            {$t('about.skills')}
          </h2>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8"> 
            {#each skills as skill (skill.name)} 
              <div class="skill-item p-3 rounded-lg bg-green-900/20 border border-green-800/30 text-center">
                <span class="font-medium text-white">{skill.name}</span>
              </div>
            {/each}
          </div>


          <h2 id="games" class="flex items-center gap-2">
            <Gamepad2 class="h-5 w-5 text-green-500" />
            Games I Enjoy
          </h2>
          <p class="mb-6">
            Here are some of the games I'm currently playing or enjoy:
          </p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {#each ['Dead by Daylight', 'Stardew Valley', 'Marvel Rivals', 'Pokémon TCG', 'Fortnite'] as game (game)}
              <div class="p-3 rounded-lg bg-green-900/20 border border-green-800/30 text-center">
                <div class="text-white font-medium">{game}</div>
              </div>
            {/each}
          </div>
      </article>
    </div>
  </div>
</main>

<style>
  .readme-header {
    border-bottom: 1px solid rgba(76, 175, 80, 0.3); 
    padding-bottom: 1rem; 
    margin-bottom: 2rem; 
  }

  .content-container {
    background-color: rgba(17, 24, 39, 0.8); 
    backdrop-filter: blur(10px); 
    border: 1px solid rgba(55, 65, 81, 0.3); 
  }

  .skill-item, 
  .p-3.rounded-lg.bg-green-900\/20 { 
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }

  .skill-item:hover,
  .p-3.rounded-lg.bg-green-900\/20:hover { 
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 255, 100, 0.1); 
  }
  
  .prose h2 {
    margin-top: 2.5em; 
    margin-bottom: 1em; 
    border-bottom: 1px solid rgba(76, 175, 80, 0.2); 
    padding-bottom: 0.5em;
  }

  .prose p {
    line-height: 1.7; 
    margin-bottom: 1.25em;
  }

  .prose h2 .lucide {
    vertical-align: middle;
  }

</style>
