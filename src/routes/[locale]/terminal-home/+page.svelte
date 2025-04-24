<script lang="ts">
  import { t } from '$lib/i18n/translations';
  import { page } from '$app/stores';
  import SEO from '$lib/components/SEO.svelte';
  import Terminal from '$lib/components/Terminal.svelte';
  
  $: pageTitle = `md.gabrielolv.dev`;
</script>

<SEO 
  title="Terminal Interface | Gabriel's Blog"
  description="Interactive command-line interface for navigating the website"
  type="website"
  canonical={`https://md.gabrielolv.dev/${$page.params.locale}/terminal-home`}
/>

<main class="min-h-screen py-8 sm:py-10">
  <div class="max-w-4xl mx-auto px-4 sm:px-8">
    <div class="content-container rounded-lg shadow-md p-6 sm:p-8">
      <header class="mb-8 text-center">
        <h1 class="text-3xl sm:text-4xl font-bold mb-4 text-white">{pageTitle}</h1>
        <p class="text-gray-300 text-lg">Welcome to my interactive terminal interface</p>
      </header>
      
      <div class="terminal-wrapper h-[500px] mb-8">
        <Terminal />
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-green-900/20 p-6 rounded-lg border border-green-800/30">
          <h2 class="text-xl font-bold mb-4 text-white">What is this?</h2>
          <p class="text-gray-300 mb-4">
            This is an interactive terminal interface that allows you to navigate my website like a file system.
            You can use commands like <code>cd</code>, <code>ls</code>, and <code>cat</code> to explore the content.
          </p>
          <p class="text-gray-300">
            Try typing <code>help</code> to see all available commands or click on directories and files to navigate.
          </p>
        </div>
        
        <div class="bg-green-900/20 p-6 rounded-lg border border-green-800/30">
          <h2 class="text-xl font-bold mb-4 text-white">Quick Tips</h2>
          <ul class="space-y-2 text-gray-300">
            <li>• Use <code>cd about</code> to visit my about page</li>
            <li>• Use <code>cd projects</code> to see my projects</li>
            <li>• Try <code>cat resume.pdf</code> to view my resume</li>
            <li>• Use <code>ls -a</code> to see hidden files</li>
            <li>• Press <kbd>Tab</kbd> for autocompletion</li>
          </ul>
        </div>
      </div>
      
      <div class="mt-8 text-center">
        <a href="/{$page.params.locale}" class="inline-block px-6 py-3 bg-green-700 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
          Switch to Standard Interface
        </a>
      </div>
      
      <footer class="mt-16 pt-6 border-t border-green-800/50 text-center text-gray-400 text-sm">
        <p>{$t('common.footer', { year: new Date().getFullYear().toString() })}</p>
      </footer>
    </div>
  </div>
</main>

<style>
  code {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 0.15rem 0.3rem;
    border-radius: 0.25rem;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 0.9em;
  }
  
  kbd {
    background-color: #2d3748;
    border: 1px solid #4a5568;
    border-radius: 0.25rem;
    padding: 0.1rem 0.3rem;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 0.9em;
  }
</style>
