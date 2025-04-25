<script lang="ts">
  import { page } from '$app/state';
  import { User, FilePen, Mail, FileText, Briefcase } from 'lucide-svelte';
  import BaseFileExplorer from './BaseFileExplorer.svelte';
  import LanguageToggle from './LanguageToggle.svelte';

  const currentPath = $derived(page.url.pathname);
  const locale = $derived(page.params.locale);

  // Directory structure
  const fileSystem = {
    '/': {
      type: 'directory',
      children: {
        'about': { type: 'directory', icon: User, description: 'About me & contact information' },
        'contact': { type: 'directory', icon: Mail, description: 'Contact form' },
        'projects': { type: 'directory', icon: Briefcase, description: 'Personal and professional projects' },
        'posts': { type: 'directory', icon: FilePen, description: 'Blog posts and articles', children: {} },
        'resume.pdf': { type: 'file', icon: FileText, description: 'My resume', url: '/resume.pdf' }
      }
    }
  };

  // Breadcrumbs
  function getBreadcrumbs() {
    const breadcrumbs = [{ name: locale, path: `/${locale}` }];
    const segments = currentPath.split('/').filter(segment => segment.length > 0);
    let path = `/${locale}`;
    for (const segment of segments.slice(1)) {
      path += `/${segment}`;
      breadcrumbs.push({ name: segment, path });
    }
    return breadcrumbs;
  }
  const breadcrumbs = $derived(getBreadcrumbs());
</script>

<BaseFileExplorer {fileSystem} {currentPath} {locale} {breadcrumbs}>
  <LanguageToggle />
</BaseFileExplorer>
