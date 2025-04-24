<script lang="ts">
  import { t } from '$lib/i18n/translations';
  import { page } from '$app/stores';
  import SEO from '$lib/components/SEO.svelte';
  import Terminal from '$lib/components/Terminal.svelte';
  
  $: pageTitle = `md.gabrielolv.dev/terminal`;
</script>

<SEO 
  title="Terminal | Gabriel's Blog"
  description="Interactive command-line interface for navigating the website"
  type="website"
  canonical={`https://md.gabrielolv.dev/${$page.params.locale}/terminal`}
/>

<main class="min-h-screen py-8 sm:py-10">
  <div class="max-w-4xl mx-auto px-4 sm:px-8">
    <div class="content-container rounded-lg shadow-md p-6 sm:p-8">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-white mb-4">{pageTitle}</h1>
        <p class="text-gray-300">Navigate the website using command-line interface. Type <code>help</code> to see available commands.</p>
      </div>
      
      <div class="terminal-wrapper h-[500px]">
        <Terminal />
      </div>
      
      <div class="mt-8 pt-6 border-t border-green-800/30">
        <h2 class="text-xl font-bold mb-4 text-white">Quick Guide</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold mb-2 text-white">Navigation Commands</h3>
            <ul class="space-y-2 text-gray-300">
              <li><code>cd [directory]</code> - Change directory</li>
              <li><code>cd ..</code> - Go up one level</li>
              <li><code>ls</code> - List contents</li>
              <li><code>ls -a</code> - List all contents (including hidden)</li>
              <li><code>ls -l</code> - List with details</li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-2 text-white">Other Commands</h3>
            <ul class="space-y-2 text-gray-300">
              <li><code>cat [file]</code> - View file contents</li>
              <li><code>clear</code> - Clear the terminal</li>
              <li><code>help</code> - Show help message</li>
              <li>Use <kbd>Tab</kbd> for autocompletion</li>
              <li>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate command history</li>
            </ul>
          </div>
        </div>
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
