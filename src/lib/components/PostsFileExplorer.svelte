<script lang="ts">
	import { page } from '$app/state';
	import BaseFileExplorer from './BaseFileExplorer.svelte';
	import LanguageToggle from './LanguageToggle.svelte';
  import { postsFileSystemByLocale } from '$lib/utils/posts';

	const currentPath = $derived(page.url.pathname);
	const locale = $derived(page.params.locale);

  const fileSystem = $derived(postsFileSystemByLocale[locale] ?? {});

  const breadcrumbs = $derived([
    { name: locale, path: `/${locale}` },
    { name: 'posts', path: `/${locale}/posts` },
  ]);

</script>

<BaseFileExplorer {fileSystem} {currentPath} {locale} {breadcrumbs}>
  <LanguageToggle />
</BaseFileExplorer>

<style>
  /* Keep this style block minimal. Most styling should come from BaseFileExplorer or global styles. */
</style>
