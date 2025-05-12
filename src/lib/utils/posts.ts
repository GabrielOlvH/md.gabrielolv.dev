import { defaultLocale } from '$lib/i18n';
import { markdownToHtml, type TocItem } from '$lib/utils/markdown';

export interface PostMetadata {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags: string[];
	readingTime: number;
	locale: string;
	translations?: string[]; // Available translations for this post
}

function estimateReadingTime(content: string): number {
	const wordsPerMinute = 200;
	const wordCount = content.split(/\s+/).length;
	return Math.ceil(wordCount / wordsPerMinute);
}

function parseFrontmatter(content: string) {
	const regex = /---\s*([\s\S]*?)\s*---/;
	const match = content.match(regex);
	if (!match) return { frontmatter: {}, content };
	const rawFm = match[1];
	const body = content.replace(regex, '').trim();
	const fm: Record<string, string | string[]> = {};
	for (const line of rawFm.split('\n')) {
		const [key, ...rest] = line.split(':');
		if (!rest.length) continue;
		let val: string | string[] = rest.join(':').trim();
		if (val.startsWith('[') && val.endsWith(']')) {
			val = val
				.slice(1, -1)
				.split(',')
				.map((s) => s.trim());
		}
		fm[key.trim()] = val;
	}
	return { frontmatter: fm, content: body };
}

type PostEntry = {
	metadata: PostMetadata;
	html: string;
	toc: TocItem[];
};

const module = import.meta.glob('/posts/*/*.md', { query: '?raw', import: 'default', eager: true });

// Process all posts
const allEntries: PostEntry[] = Object.entries(module).map(([path, raw]) => {
	// Extract locale and slug from the path
	const pathParts = path.split('/');
	const filename = pathParts.pop()!;
	// Determine locale from directory or filename
	const fileLocale: string = pathParts[pathParts.length - 1];
	const slug: string = filename.replace(/\.mdx?$/, '');

	// Parse frontmatter
	const { frontmatter, content } = parseFrontmatter(raw as string);

	const date = frontmatter.date
		? new Date(frontmatter.date as string).toISOString()
		: new Date().toISOString();

	const readingTime = estimateReadingTime(content);

	const metadata: PostMetadata = {
		slug,
		title: (frontmatter.title as string) || slug,
		date,
		readingTime,
		tags: (frontmatter.tags as string[]) || [],
		excerpt:
			(frontmatter.excerpt as string) ||
			(content.length > 150 ? content.slice(0, 150) + '…' : content),
		locale: fileLocale
	};

	// Convert markdown to HTML
	const { html, toc } = markdownToHtml(content);

	return { metadata, html, toc };
});

// Group posts by slug across all locales to identify translations
const postsBySlug = allEntries.reduce(
	(acc, entry) => {
		const { slug } = entry.metadata;
		if (!acc[slug]) acc[slug] = [];
		acc[slug].push(entry);
		return acc;
	},
	{} as Record<string, PostEntry[]>
);

// Add translation information to each post
Object.values(postsBySlug).forEach((entries) => {
	if (entries.length > 1) {
		// This post has translations
		const availableLocales = entries.map((entry) => entry.metadata.locale);

		// Add translations to each entry's metadata
		entries.forEach((entry) => {
			entry.metadata.translations = availableLocales.filter(
				(locale) => locale !== entry.metadata.locale
			);
		});
	}
});

// Build lookup tables
const postsByLocale = allEntries.reduce(
	(acc, { metadata }) => {
		const list = acc[metadata.locale] ?? [];
		list.push(metadata);
		acc[metadata.locale] = list;
		return acc;
	},
	{} as Record<string, PostMetadata[]>
);

const postMap = allEntries.reduce(
	(acc, { metadata, html, toc }) => {
		const mapForLocale = acc[metadata.locale] ?? {};
		mapForLocale[metadata.slug] = { metadata, html, toc };
		acc[metadata.locale] = mapForLocale;
		return acc;
	},
	{} as Record<string, Record<string, { metadata: PostMetadata; html: string; toc: TocItem[] }>>
);

export function getAllPosts(locale: string): PostMetadata[] {
	const posts = postsByLocale[locale] ?? [];
	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(
	slug: string,
	locale: string
): { metadata: PostMetadata; content: string; toc: TocItem[] } | null {
	const entry = postMap[locale]?.[slug] ?? postMap[defaultLocale]?.[slug] ?? null;
	if (!entry) return null;
	return {
		metadata: entry.metadata,
		content: entry.html,
		toc: entry.toc
	};
}

// Get all available locales for a specific post slug
export function getAvailableLocalesForPost(slug: string): string[] {
	const entries = postsBySlug[slug] || [];
	return entries.map((entry) => entry.metadata.locale);
}

// Helper function to determine if a post has a translation in a specific locale
export function hasTranslation(post: PostMetadata, locale: string): boolean {
	return post.translations?.includes(locale) || false;
}
