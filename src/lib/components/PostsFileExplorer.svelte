<script lang="ts">
	import { page } from '$app/state';
  import type { PostMetadata } from '$lib/utils/posts';
	import { FileText } from 'lucide-svelte';
	import { formatDate, t, locale as appLocale } from '$lib/i18n/translations';
	import BaseFileExplorer from './BaseFileExplorer.svelte';
	import LanguageToggle from './LanguageToggle.svelte';
	import type { ExplorerItem } from './BaseFileExplorer.svelte';

	const { posts = [] } = $props<{ posts: Array<PostMetadata> }>();

	const currentPath = $derived(page.url.pathname);
	const locale = $derived(page.params.locale);

  const fileSystem = $derived({
    [`/${locale}/posts`]: {
      type: 'directory',
      children: posts.reduce((acc: Record<string, ExplorerItem>, post: PostMetadata) => {
        acc[`${post.slug}.md`] = {
          name: post.title,
          type: 'file',
          icon: FileText,
          description: `${post.excerpt} (${formatDate(new Date(post.date), $appLocale)}, ${post.readingTime} ${$t('common.minRead')})`,
          url: `/${locale}/posts/${post.slug}`,
        };
        return acc;
      }, {}),
    },
  });

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
