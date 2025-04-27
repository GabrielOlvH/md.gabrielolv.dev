<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
  import type { PostMetadata } from '$lib/utils/posts';
	import { FileText, ArrowUp, Calendar } from 'lucide-svelte';
	import { formatDate, t, locale } from '$lib/i18n/translations';
	import { onMount } from 'svelte';
	import LanguageToggle from './LanguageToggle.svelte';

	const { posts = [] } = $props<{ posts: Array<PostMetadata> }>();

	const currentPath = $derived(page.url.pathname);
	const currentLocale = $derived(page.params.locale);

	let isMobile = false;
	let urlDisplayElement: HTMLElement;

	onMount(() => {
		isMobile = window.innerWidth < 640;

		const handleResize = () => {
			isMobile = window.innerWidth < 640;
		};
		window.addEventListener('resize', handleResize);

		if (urlDisplayElement) {
			urlDisplayElement.scrollLeft = urlDisplayElement.scrollWidth;
		}

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});


	const dirContent = $derived(
		posts.map((post: PostMetadata) => ({
			name: `${post.slug}.md`,
			type: 'file',
			icon: FileText,
			description: post.excerpt,
			metadata: post,
			url: `/${currentLocale}/posts/${post.slug}`
		}))
	);

	function navigateTo(item: (typeof dirContent)[0]) {
		if (item.url) {
			goto(item.url);
		}
	}

	function goUp() {
		const pathWithoutLocale = currentPath.replace(`/${currentLocale}`, '') || '/';
		const segments = pathWithoutLocale.split('/').filter(segment => segment.length > 0);

		if (segments.length === 0) return;

		segments.pop();
		const newPath = segments.length === 0 ? '' : '/' + segments.join('/');
		goto(`/${currentLocale}${newPath}`);
	}

	function getBreadcrumbs() {
		const breadcrumbs = [{ name: currentLocale, path: `/${currentLocale}` }];
		const segments = currentPath.split('/').filter(segment => segment.length > 0);

		let currentBreadcrumbPath = `/${currentLocale}`;

		for (let i = 1; i < segments.length; i++) {
			const segment = segments[i];
			currentBreadcrumbPath += `/${segment}`;
			breadcrumbs.push({
				name: segment,
				path: currentBreadcrumbPath
			});
		}
		return breadcrumbs;
	}

	function getBreadcrumbDisplay(crumb: { name: string, path: string }, index: number) {
		if (!isMobile || breadcrumbs.length <= 2) {
			return crumb.name;
		}
		if (index > 0 && index < breadcrumbs.length - 1) {
			return '...';
		}
		return crumb.name;
	}

	const breadcrumbs = $derived(getBreadcrumbs());

</script>

<div class="file-explorer">
	<div class="url-display-container">
		<div class="url-display" bind:this={urlDisplayElement}>
			<span class="domain">md.gabrielolv.dev</span>
			{#each breadcrumbs as crumb, i (crumb.path)}
				<span class="separator">/</span>
				<a
					href={crumb.path}
					class="path-segment {i === breadcrumbs.length - 1 ? 'current' : ''}"
					aria-current={i === breadcrumbs.length - 1 ? 'page' : undefined}
				>
					{getBreadcrumbDisplay(crumb, i)}
				</a>
			{/each}
			<span class="cursor">█</span>
		</div>
		<div class="language-toggle-container">
			<LanguageToggle />
		</div>
	</div>

	<div class="directory-content">

		<div class="directory-item go-up" role="button" tabindex="0" aria-label="Go up one level"
				 onclick={goUp}
				 onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') goUp(); }}>
			<span class="item-icon"><ArrowUp size={18} /></span>
			<span class="item-name">..</span>
			<span class="item-description">Parent directory</span>
		</div>

		{#each dirContent as item (item.metadata.slug)}
			<div class="post-item" role="button" tabindex="0" aria-label={`Read post: ${item.metadata.title}`}
					 onclick={() => navigateTo(item)}
					 onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo(item); }}>
				<div class="post-header">
            <span class="item-icon">
              <svelte:component this={item.icon} size={18} class="text-green-500" />
            </span>
					<span class="item-name">{item.metadata.title}</span>
					<span class="post-date">
              <Calendar size={14} class="mr-1" />
						{formatDate(new Date(item.metadata.date), $locale)}
            </span>
				</div>
				<div class="post-content">
					<h3 class="post-title">{item.metadata.title}</h3>
					<p class="post-excerpt">{item.metadata.excerpt}</p>

					{#if item.metadata.tags && item.metadata.tags.length > 0}
						<div class="post-tags">
							{#each item.metadata.tags as tag (tag)}
								<span class="post-tag">{tag}</span>
							{/each}
						</div>
					{/if}

					<div class="post-footer">
              <span class="post-reading-time">
                {item.metadata.readingTime} {$t('common.minRead')}
              </span>
						<span class="post-read-more">{$t('common.readMore')} →</span>
					</div>
				</div>
			</div>
		{/each}

	</div>
</div>

<style>
    .file-explorer {
        margin-bottom: 1rem;
    }

    .url-display-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .url-display {
        padding: 8px 12px;
        font-family: 'Fira Code', 'Courier New', monospace;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
        white-space: nowrap;
        overflow-x: auto;
        display: flex;
        align-items: center;
        scrollbar-width: thin;
        scrollbar-color: rgba(76, 175, 80, 0.3) transparent;
        flex: 1;
    }

    .language-toggle-container {
        padding-right: 12px;
        display: flex;
        align-items: center;
    }

    .url-display::-webkit-scrollbar {
        height: 4px;
    }

    .url-display::-webkit-scrollbar-track {
        background: transparent;
    }

    .url-display::-webkit-scrollbar-thumb {
        background-color: rgba(76, 175, 80, 0.3);
        border-radius: 2px;
    }

    @media (min-width: 640px) {
        .url-display {
            padding: 12px 16px;
            font-size: 18px;
        }

        .file-explorer {
            margin-bottom: 1.5rem;
        }
    }

    .domain {
        color: #ffffff;
        font-weight: 600;
        margin-right: 2px;
    }

    .separator {
        color: rgba(255, 255, 255, 0.7);
        margin: 0 2px;
    }

    .path-segment {
        color: #ffffff;
        text-decoration: none;
        transition: color 0.2s;
        font-weight: 500;
    }

    .path-segment:hover {
        color: #4CAF50;
        text-decoration: underline;
    }

    .path-segment.current {
        color: #4CAF50;
        font-weight: 700;
    }

    .cursor {
        color: #4CAF50;
        animation: blink 1s step-end infinite;
        margin-left: 2px;
    }

    @keyframes blink {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }

    .directory-content {
        list-style: none;
        padding: 0;
        margin: 0;
        box-shadow: 0 0 5px inset rgba(0, 0, 0, 0.25);
        background-color: rgba(0, 0, 0, 0.05);
        min-height: 100px;
    }

    .directory-item {
        display: flex;
        align-items: center;
        gap: 0.5em;
        padding: 10px 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        border-left: 3px solid transparent;
        font-family: 'Fira Code', 'Courier New', monospace;
        color: #ffffff;
        font-weight: 500;
    }

    .directory-item.go-up {
        margin-bottom: 4px;
        padding-bottom: 12px;
        background: none;
        border: none;
        cursor: pointer;
        color: #4CAF50;
        display: flex;
        align-items: center;
    }

    .directory-item:hover {
        background-color: rgba(76, 175, 80, 0.1);
        border-left: 3px solid #4CAF50;
    }

    .item-icon {
        margin-right: 12px;
        font-size: 18px;
        width: 24px;
        text-align: center;
        flex-shrink: 0;
    }

    .item-name {
        font-family: 'Fira Code', 'Courier New', monospace;
        color: #ffffff;
        margin-right: 12px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .item-description {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        margin-left: auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 1em;
        flex-shrink: 0;
    }

    .post-item {
        display: flex;
        flex-direction: column;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        border-left: 3px solid transparent;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .post-item:hover {
        background-color: rgba(76, 175, 80, 0.1);
        border-left: 3px solid #4CAF50;
    }

    .post-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        gap: 0.5em;
    }

    .post-date {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-left: auto;
        white-space: nowrap;
        padding-left: 1em;
        flex-shrink: 0;
    }

    .post-content {
        padding-left: calc(24px + 12px + 0.5em);
    }

    .post-title {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #ffffff;
    }

    .post-excerpt {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0 0 12px 0;
        line-height: 1.5;
    }

    .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
    }

    .post-tag {
        font-size: 12px;
        background-color: rgba(76, 175, 80, 0.2);
        color: #4CAF50;
        padding: 2px 8px;
        border-radius: 4px;
        font-family: 'Fira Code', 'Courier New', monospace;
    }

    .post-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
    }

    .post-reading-time {
        color: rgba(255, 255, 255, 0.6);
    }

    .post-read-more {
        color: #4CAF50;
        font-weight: 600;
    }
</style>
