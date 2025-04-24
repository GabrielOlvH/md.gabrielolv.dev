<script lang="ts">
  import { t } from '$lib/i18n/translations';
  import { page } from '$app/stores';
  import SEO from '$lib/components/SEO.svelte';
  import FileExplorer from '$lib/components/FileExplorer.svelte';
  import TableOfContents from '$lib/components/TableOfContents.svelte';
  import { User, Wrench, Sparkles, Mail } from 'lucide-svelte';
  
  // Skills with proficiency levels (0-100)
  const skills = [
    { name: 'JavaScript', level: 90, color: '#F7DF1E' },
    { name: 'TypeScript', level: 85, color: '#3178C6' },
    { name: 'React', level: 88, color: '#61DAFB' },
    { name: 'Svelte', level: 82, color: '#FF3E00' },
    { name: 'Node.js', level: 80, color: '#339933' },
    { name: 'HTML/CSS', level: 92, color: '#E34F26' },
    { name: 'Python', level: 75, color: '#3776AB' },
    { name: 'SQL', level: 78, color: '#4479A1' }
  ];
  
  // Social links
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/yourusername', icon: 'github' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', icon: 'linkedin' },
    { name: 'Twitter', url: 'https://twitter.com/yourusername', icon: 'twitter' }
  ];
  
  // Form state
  let name = '';
  let email = '';
  let message = '';
  let formSubmitted = false;
  
  function handleSubmit() {
    // This would normally send the form data to a server
    // For now, we'll just simulate a successful submission
    formSubmitted = true;
  }
</script>

<SEO 
  title={`${$t('about.title')} | Gabriel's Blog`}
  description={$t('about.subtitle')}
  type="website"
  canonical={`https://md.gabrielolv.dev/${$page.params.locale}/about`}
/>

<main class="min-h-screen py-8 sm:py-10">
  <!-- Mobile Table of Contents (shown at the top on small screens) -->
  <div class="lg:hidden max-w-3xl mx-auto px-4 sm:px-8 mb-6">
    <details class="toc-mobile-container">
      <summary class="toc-mobile-summary">
        <span class="text-lg font-bold text-white">README Contents</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div class="pt-4">
        <TableOfContents />
      </div>
    </details>
  </div>
  
  <!-- Desktop layout with centered content and TOC on left -->
  <div class="relative max-w-3xl mx-auto px-4 sm:px-8">
    <!-- Left sidebar for table of contents (desktop only) -->
    <div class="hidden lg:block absolute right-full top-0 pr-8 w-64">
      <div class="fixed">
        <TableOfContents />
      </div>
    </div>
    
    <!-- Main content (centered) -->
    <div class="content-container rounded-lg shadow-md p-6 sm:p-8">
      <!-- File Explorer Navigation -->
      <FileExplorer />
      
      <!-- README Content -->
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
          
          <div class="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div class="w-48 h-48 relative overflow-hidden rounded-full border-4 border-green-500/30 shadow-lg">
              <!-- Placeholder profile image - replace with actual image -->
              <div class="absolute inset-0 bg-gradient-to-br from-green-700 to-green-900">
                <div class="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white">G</div>
              </div>
            </div>
            
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
          
          <div class="grid gap-4 mb-8">
            {#each skills as skill}
              <div class="skill-item">
                <div class="flex justify-between mb-1">
                  <span class="font-medium text-white">{skill.name}</span>
                  <span class="text-gray-400">{skill.level}%</span>
                </div>
                <div class="h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full" 
                    style="width: {skill.level}%; background-color: {skill.color};"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
          
          <h2 id="interests" class="flex items-center gap-2">
            <Sparkles class="h-5 w-5 text-green-500" />
            Interests & Hobbies
          </h2>
          
          <p class="mb-6">
            {$t('about.interests')}
          </p>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {#each ['Coding', 'Open Source', 'Learning', 'Hiking'] as interest}
              <div class="p-3 rounded-lg bg-green-900/20 border border-green-800/30 text-center">
                <div class="text-white font-medium">{interest}</div>
              </div>
            {/each}
          </div>
          
          <h2 id="contact" class="flex items-center gap-2">
            <Mail class="h-5 w-5 text-green-500" />
            {$t('contact.title')}
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
            <!-- Contact form -->
            <div>
              <h3 id="contact-form">{$t('contact.formSubmit')}</h3>
              
              {#if !formSubmitted}
                <form 
                  on:submit|preventDefault={handleSubmit}
                  class="space-y-6"
                >
                  <div class="form-group">
                    <label for="name" class="form-label">{$t('contact.formName')}</label>
                    <input 
                      type="text" 
                      id="name" 
                      bind:value={name} 
                      required
                      class="form-input"
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="email" class="form-label">{$t('contact.formEmail')}</label>
                    <input 
                      type="email" 
                      id="email" 
                      bind:value={email} 
                      required
                      class="form-input"
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="message" class="form-label">{$t('contact.formMessage')}</label>
                    <textarea 
                      id="message" 
                      bind:value={message} 
                      required
                      rows="5"
                      class="form-input"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    class="submit-button"
                  >
                    {$t('contact.formSubmit')}
                  </button>
                </form>
              {:else}
                <div class="success-message">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 class="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p class="text-gray-300 mb-4">{$t('contact.response')}</p>
                  <button 
                    on:click={() => formSubmitted = false}
                    class="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              {/if}
            </div>
            
            <!-- Social links -->
            <div>
              <h3 id="social-links">{$t('contact.socialConnect')}</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {#each socialLinks as link}
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="social-card"
                  >
                    {#if link.icon === 'github'}
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    {:else if link.icon === 'linkedin'}
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    {:else if link.icon === 'twitter'}
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    {/if}
                    <span class="social-name">{link.name}</span>
                  </a>
                {/each}
              </div>
              
              <h3 id="email-contact">{$t('contact.emailMe')}</h3>
              <div class="email-section">
                <a 
                  href="mailto:your.email@example.com" 
                  class="email-link"
                >
                  your.email@example.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
      
      <footer class="mt-16 pt-6 border-t border-green-800/50 text-center text-gray-400 text-sm">
        <p>{$t('common.footer', { year: new Date().getFullYear().toString() })}</p>
      </footer>
    </div>
  </div>
</main>

<style>
  .readme-header {
    border-bottom: 1px solid rgba(76, 175, 80, 0.3);
    margin-bottom: 2rem;
    padding-bottom: 1rem;
  }
  
  .skill-item {
    transition: transform 0.2s ease;
  }
  
  .skill-item:hover {
    transform: translateX(4px);
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .form-input {
    width: 100%;
    padding: 0.75rem;
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(76, 175, 80, 0.3);
    border-radius: 0.375rem;
    color: white;
    transition: all 0.3s ease;
  }
  
  .form-input:focus {
    outline: none;
    border-color: rgba(76, 175, 80, 0.7);
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    background-color: rgba(255, 255, 255, 0.08);
  }
  
  .submit-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    background-color: #4CAF50;
    color: white;
    font-weight: 600;
    border-radius: 0.375rem;
    transition: all 0.3s ease;
  }
  
  .submit-button:hover {
    background-color: #3d8b40;
    transform: translateY(-2px);
  }
  
  .success-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background-color: rgba(76, 175, 80, 0.1);
    border: 1px solid rgba(76, 175, 80, 0.3);
    border-radius: 0.5rem;
    text-align: center;
  }
  
  .social-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(76, 175, 80, 0.2);
    border-radius: 0.5rem;
    color: white;
    transition: all 0.3s ease;
  }
  
  .social-card:hover {
    transform: translateY(-2px);
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .social-name {
    margin-top: 0.5rem;
    font-weight: 500;
  }
  
  .email-section {
    padding: 1.5rem;
    background-color: rgba(76, 175, 80, 0.1);
    border: 1px solid rgba(76, 175, 80, 0.2);
    border-radius: 0.5rem;
    margin-top: 1.5rem;
  }
  
  .email-link {
    display: inline-block;
    font-size: 1.125rem;
    color: #4CAF50;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  .email-link:hover {
    color: #3d8b40;
    text-decoration: underline;
  }
  
  .toc-mobile-container {
    background-color: transparent;
    padding: 0.5rem 0;
  }
  
  .toc-mobile-summary {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }
  
  details[open] .toc-mobile-summary svg {
    transform: rotate(180deg);
  }
</style>
