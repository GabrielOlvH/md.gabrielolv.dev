<script lang="ts">
  import { page } from '$app/state';
  import BaseFileExplorer from './BaseFileExplorer.svelte';
  import LanguageToggle from './LanguageToggle.svelte';
  import { Globe, Wrench, FileText, Blocks, Gamepad } from 'lucide-svelte';

  let { projects }: { projects: any[]; } = $props();

  const locale = $derived(page.params.locale);
  const currentPath = $derived(page.url.pathname);

  const fileSystem = $derived({
    [`/${locale}/projects`]: {
      type: 'directory',
      children: projects.reduce((acc, project) => {
        acc[project.name] = {
          type: 'file',
          icon: getCategoryIcon(project.category),
          description: project.description,
          url: project.url,
          external: true, 
          category: project.category
        };
        return acc;
      }, {}),
    },
  });

  function getCategoryIcon(category: string) {
    switch (category) {
      case 'websites': return Globe;
      case 'tools': return Wrench;
      case 'games': return Gamepad;
      case 'minecraft': return Blocks;
      default: return FileText;
    }
  }

  const breadcrumbs = $derived([
    { name: locale, path: `/${locale}` },
    { name: 'projects', path: `/${locale}/projects` },
  ]);

</script>

<BaseFileExplorer {fileSystem} {currentPath} {locale} {breadcrumbs} isProjectExplorer={true}>
  <LanguageToggle />
</BaseFileExplorer>

<style>
</style>
