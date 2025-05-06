<script lang="ts">
  import FileExplorer from '$lib/components/FileExplorer.svelte';
  import { t } from '$lib/i18n/translations';
  import SEO from '$lib/components/SEO.svelte';
  import { page } from '$app/state';
  import { Download } from 'lucide-svelte';

  const locale = $derived(page.params.locale);
  
  // Set resume file and display text based on current language
  const resumeFile = $derived(locale === 'pt' ? 'resume_pt.pdf' : 'resume_en.pdf');
  const fileName = $derived(locale === 'pt' ? 'Gabriel_Henrique_Oliveira_Curriculo.pdf' : 'Gabriel_Henrique_Oliveira_Resume.pdf');
  const downloadText = $derived(locale === 'pt' ? 'Baixar' : 'Download');

  async function trackDownload() {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventType: 'resume_download',
          path: `/${locale}/resume`,
          language: locale,
          doubles: [1],
          blobs: [resumeFile]
        })
      });
    } catch (error) {
      console.error('Failed to track resume download:', error);
    }
  }
</script>

<SEO
  title={$t('resume.title')}
  description={$t('resume.description')}
  type="article"
  canonical={`https://md.gabrielolv.dev/${locale}/resume`}
/>

<main class="min-h-screen py-8 sm:py-10">
  <div class="max-w-4xl w-full mx-auto px-4 sm:px-8">
    <div class="content-container rounded-lg shadow-md p-6 sm:p-8">
      <FileExplorer />
      <h1 class="text-2xl font-bold mb-6">{$t('resume.title')}</h1>
      
      <div class="mb-8">
        <p class="mb-6">{$t('resume.intro')}</p>
        
        <div class="flex mb-4">
          <a 
            href={`/${resumeFile}`} 
            download={fileName}
            onclick={trackDownload}
            class="flex items-center gap-2 px-6 py-3  text-white rounded-md  transition-colors"
          >
            <Download size={18} />
            {downloadText}
          </a>
        </div>
        
        <!-- PDF Embed -->
        <div class="pdf-container border rounded-lg overflow-hidden">
          <iframe 
            src={`/${resumeFile}`} 
            title={$t('resume.title')}
            class="w-full h-full"
            style="min-height: 800px;"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</main>

<style>


</style>
