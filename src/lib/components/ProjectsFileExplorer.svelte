<script lang="ts">

  import { page } from '$app/state';
  import BaseFileExplorer from './BaseFileExplorer.svelte';
  import type { ExplorerItem } from './BaseFileExplorer.svelte';
  import LanguageToggle from './LanguageToggle.svelte';
  import { projectsFileSystemByLocale } from '$lib/utils/projects';
  import { t } from '$lib/i18n/translations';

  type ProjectExplorerItemWithKeys = ExplorerItem & { nameKey?: string; descriptionKey?: string };

  const locale = $derived(page.params.locale);
  const currentPath = $derived(page.url.pathname);


  const fileSystem = $derived((() => {
    
    const baseFileSystemForLocale = projectsFileSystemByLocale[locale] ?? {}; 
    
    
    const projectsDirKey = `/${locale}/projects`;
    const projectsDir = baseFileSystemForLocale[projectsDirKey] as ProjectExplorerItemWithKeys | undefined;


    if (!projectsDir || !projectsDir.children) {
      return {};
    }
  

    const translatedChildren = Object.entries(projectsDir.children).reduce(
      (acc, [key, item]: [string, ProjectExplorerItemWithKeys]) => {
        acc[key] = {
          ...item,
          name: item.nameKey ? $t(item.nameKey) : item.name, // Fallback to item.name if key is missing
          description: item.descriptionKey ? $t(item.descriptionKey) : item.description, // Fallback
        };
        return acc;
      },
      {} as Record<string, ExplorerItem>
    );

    return {
      [projectsDirKey]: {
        ...projectsDir,
        children: translatedChildren,
      },
    };
  })());

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
