<script lang="ts">
  import { t } from '$lib/i18n/translations';
  import { page } from '$app/state';
  import SEO from '$lib/components/SEO.svelte';
  import FileExplorer from '$lib/components/FileExplorer.svelte';
  import { Mail, Github, Linkedin, ExternalLink, MessageCircle } from 'lucide-svelte'; // Added MessageCircle for Discord

  // Updated Social media links to include Discord and specific username for Discord
  const contactMethods = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/GabrielOlvH',
      ariaLabel: 'Visit my GitHub profile',
      cta: 'View Profile'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/gabriel-oliveira-a11564243/',
      ariaLabel: 'Connect with me on LinkedIn',
      cta: 'Connect'
    },
    {
      name: 'Discord',
      icon: MessageCircle, // Using MessageCircle as a placeholder for Discord icon
      text: 'notsteven13', // Discord username/ID
      ariaLabel: 'Add me on Discord',
      cta: 'Add Friend' // Or Copy ID, depending on desired action
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:contact@gabrielolv.dev',
      ariaLabel: 'Send me an email',
      cta: 'Send Email'
    }
  ];
</script>

<SEO
  title={`${$t('contact.title')} | Gabriel's Blog`}
  description={$t('contact.subtitle')}
  type="website"
  canonical={`https://md.gabrielolv.dev/${page.params.locale}/contact`}
/>

<main class="min-h-screen sm:py-10">
  <div class="relative max-w-3xl mx-auto sm:px-8">
    <div class="content-container rounded-lg shadow-xl p-6 sm:p-8">
      <FileExplorer />
      <article>
        <div class="readme-header">
          <h1 class="text-3xl sm:text-4xl font-bold mb-4 text-white flex items-center gap-3">
            <Mail class="h-7 w-7 text-green-500" />
            {$t('contact.title')}
          </h1>
          <div class="text-gray-400 text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</div>
        </div>

        <div class="prose prose-invert prose-green max-w-none">
          <p class="text-lg text-gray-300 mb-10">
            {$t('contact.intro')}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each contactMethods as method (method.name)}
              <div class="contact-card group">
                <div class="flex items-center mb-3">
                  <method.icon class="h-8 w-8 text-green-400 group-hover:text-green-300 transition-colors" />
                  <h3 class="ml-3 text-xl font-semibold text-white group-hover:text-green-300 transition-colors">{method.name}</h3>
                </div>
                {#if method.url}
                  <a 
                    href={method.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={method.ariaLabel}
                    class="contact-button"
                  >
                    {method.cta}
                    <ExternalLink class="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                {:else if method.text} 
                  <button 
                    class="contact-button-text-copy"
                    aria-label={`Copy my ${method.name} ID: ${method.text}`}
                    onclick={() => {
                      navigator.clipboard.writeText(method.text || '');
                      // Optionally, provide feedback to the user that text was copied
                      alert(`${method.name} ID copied to clipboard: ${method.text}`);
                    }}
                  >
                    <span>{method.text}</span>
                    <span class="copy-text">(Click to copy)</span>
                  </button>
                {/if}
              </div>
            {/each}
          </div>

          <!-- Removed availability and expertise sections -->

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
    border-bottom: 1px solid rgba(76, 175, 80, 0.4);
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
  }

  .content-container {
    background-color: rgba(17, 24, 39, 0.85); /* Darker, slightly more opaque background */
    backdrop-filter: blur(12px); /* Increased blur for frosted glass effect */
    border: 1px solid rgba(55, 65, 81, 0.4); /* Slightly more prominent border */
    box-shadow: 0 8px 30px rgba(0, 255, 120, 0.1); /* Softer, greenish shadow */
  }

  .contact-card {
    background-color: rgba(24, 32, 47, 0.6); /* Darker, more transparent card background */
    padding: 1.75rem; /* p-7, increased padding */
    border-radius: 0.5rem; /* rounded-lg */
    border: 1px solid rgba(55, 65, 81, 0.7); /* Slightly darker border, more opacity */
    transition: all 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3); /* More subtle shadow initially */
  }

  .contact-card:hover {
    border-color: rgba(46, 160, 67, 0.7); /* More saturated green border on hover */
    box-shadow: 0 5px 20px rgba(46, 160, 67, 0.2); /* Softer, more spread out green glow */
    transform: translateY(-3px); /* Slightly more lift */
  }

  .contact-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem; /* py-3 px-6 */
    margin-top: 1rem; /* mt-4, more space above button */
    width: 100%;
    background-color: #38a169; /* Tailwind green-600 */
    color: white;
    font-weight: 500; /* medium, slightly less bold */
    border-radius: 0.375rem; /* rounded-md, slightly less rounded */
    transition: all 0.2s ease-in-out;
    letter-spacing: 0.025em; /* Slight letter spacing for refinement */
  }

  .contact-button:hover {
    background-color: #2f855a; /* Tailwind green-700 */
    box-shadow: 0 2px 10px rgba(46, 160, 67, 0.3);
    transform: scale(1.01); /* More subtle scale */
  }
  
  .contact-button-text-copy {
    display: flex;
    flex-direction: column; 
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.25rem; 
    margin-top: 1rem; 
    width: 100%;
    background-color: rgba(30, 41, 59, 0.7); /* Slightly darker, less opaque than card */
    color: #d1d5db; /* gray-300 */
    font-weight: 500; 
    border-radius: 0.375rem; 
    border: 1px solid rgba(76, 175, 80, 0.5); /* Green border, slightly more prominent */
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    text-align: center;
  }

  .contact-button-text-copy:hover {
    background-color: rgba(55, 65, 81, 0.8); /* gray-700 like, for hover */
    border-color: rgba(46, 160, 67, 0.8);
    color: #f3f4f6; /* gray-100 */
  }

  .contact-button-text-copy .copy-text {
    font-size: 0.8rem; /* Slightly larger */
    color: #9ca3af; /* gray-400 */
    margin-top: 0.35rem;
  }

  /* Icon and Title styling within card */
  .contact-card .flex.items-center.mb-3 .lucide {
    color: #34d399; /* Tailwind green-500, brighter icon */
    transition: color 0.3s ease-in-out;
  }
  .contact-card:hover .flex.items-center.mb-3 .lucide {
    color: #10b981; /* Tailwind green-600, slightly darker green on card hover */
  }
  .contact-card .ml-3.text-xl {
    color: #e5e7eb; /* gray-200, brighter title */
    transition: color 0.3s ease-in-out;
  }
  .contact-card:hover .ml-3.text-xl {
    color: #f9fafb; /* gray-50, even brighter on card hover */
  }

  /* Smooth scrolling for anchor links */
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
