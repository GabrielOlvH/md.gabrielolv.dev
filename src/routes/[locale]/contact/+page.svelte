<script lang="ts">
  import TableOfContentsDisplay from '$lib/components/TableOfContentsDisplay.svelte';
  import { t } from '$lib/i18n/translations';
  import { page } from '$app/stores';
  import SEO from '$lib/components/SEO.svelte';
  import FileExplorer from '$lib/components/FileExplorer.svelte';
  import { Mail, Github, Linkedin, Twitter, Code, MessageSquare, Briefcase, ExternalLink } from 'lucide-svelte';

  // Social media links
  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://github.com/GabrielOlvH' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/gabriel-oliveira' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/gabrielolvh' }
  ];
</script>

<SEO
  title={`${$t('contact.title')} | Gabriel's Blog`}
  description={$t('contact.subtitle')}
  type="website"
  canonical={`https://md.gabrielolv.dev/${$page.params.locale}/contact`}
/>

<main class="min-h-screen sm:py-10">
  <div class="relative max-w-3xl mx-auto sm:px-8">
    <TableOfContentsDisplay/>

    <div class="content-container rounded-lg shadow-md p-6 sm:p-8">
      <FileExplorer />
      <article>
        <div class="readme-header">
          <h1 class="text-3xl font-bold mb-4 text-white flex items-center gap-2">
            <Code class="h-6 w-6 text-green-500" />
            Contact Me
          </h1>
          <div class="text-gray-400 text-sm mb-6">Last updated: {new Date().toLocaleDateString()}</div>
        </div>

        <div class="prose prose-invert prose-green max-w-none">
          <div class="info-box mb-8">
            <p class="text-gray-300 mb-0 flex items-center">
              <MessageSquare class="h-5 w-5 text-green-500 mr-2" />
              I'm currently available for freelance projects, technical consultations, and collaboration opportunities.
            </p>
          </div>

          <h2 id="connect" class="flex items-center gap-2 mt-6 scroll-mt-20">
            <Linkedin class="h-5 w-5 text-green-500" />
            Connect With Me
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {#each socialLinks as link}
              <a href={link.url} target="_blank" rel="noopener noreferrer"
                class="flex items-center justify-center gap-2 p-4 bg-gray-800/60 hover:bg-gray-700 rounded-lg border border-green-800/30 transition duration-200">
                <svelte:component this={link.icon} class="h-5 w-5 text-green-500" />
                <span>{link.name}</span>
                <ExternalLink class="h-4 w-4 text-gray-400" />
              </a>
            {/each}
          </div>

          <h2 id="email" class="flex items-center gap-2 mt-12 scroll-mt-20">
            <Mail class="h-5 w-5 text-green-500" />
            Email Contact
          </h2>

          <div class="info-box mt-4">
            <p class="text-gray-300 mb-4">For professional inquiries, please reach out via email:</p>
            <a href="mailto:contact@gabrielolv.dev" class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded shadow transition duration-200">
              <Mail class="h-5 w-5" />
              contact@gabrielolv.dev
            </a>
            <p class="text-gray-400 mt-4 text-sm">I'll respond to your message as soon as possible.</p>
          </div>

          <h2 id="availability" class="flex items-center gap-2 mt-12 scroll-mt-20">
            <Briefcase class="h-5 w-5 text-green-500" />
            Availability & Response Time
          </h2>

          <div class="info-box">
            <ul class="list-disc pl-5 space-y-3">
              <li>I typically respond to all inquiries within 24-48 hours</li>
              <li>Available for remote work and consultations worldwide</li>
              <li>Open to both short-term projects and long-term collaborations</li>
              <li>Technical consultations can be scheduled via email</li>
            </ul>

            <div class="mt-6 pt-6 border-t border-green-800/30">
              <h3 class="text-lg font-medium text-green-400 mb-3">Areas of Expertise</h3>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">Web Development</span>
                <span class="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">API Design</span>
                <span class="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">Frontend</span>
                <span class="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">Backend</span>
                <span class="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">DevOps</span>
                <span class="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">Cloud Solutions</span>
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

  .content-container {
    background-color: rgba(22, 27, 34, 0.95);
    box-shadow: 0 4px 20px 0 rgba(76, 175, 80, 0.2);
    border: 1px solid rgba(76, 175, 80, 0.1);
  }

  .info-box {

    border-radius: 0.5rem;

  }

  /* Smooth scrolling for anchor links */
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
