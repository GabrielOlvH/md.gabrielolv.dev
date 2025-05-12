import { getAllPosts, getAvailableLocalesForPost } from '$lib/utils/posts';
import type { PageServerLoad, EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
  const allPosts = getAllPosts('en').concat(getAllPosts('pt')); // Get all posts from all locales
  const uniqueSlugs = [...new Set(allPosts.map(post => post.slug))];

  const entriesList: Array<{ locale: string; slug: string }> = [];

uniqueSlugs.forEach(slug => {
    const availableLocales = getAvailableLocalesForPost(slug);
    if (availableLocales.length === 0) {
      // If no specific locales, assume default or all relevant ones for that slug
      // This case might need refinement based on how getAvailableLocalesForPost is implemented
      // For now, let's try adding for both known locales if the post exists in either
      if (getAllPosts('en').find(p => p.slug === slug)) entriesList.push({ slug, locale: 'en' });
      if (getAllPosts('pt').find(p => p.slug === slug)) entriesList.push({ slug, locale: 'pt' });
    } else {
      availableLocales.forEach(locale => {
        entriesList.push({ slug, locale });
      });
    }
  });

  // Ensure unique entries if a slug might be listed under multiple locales by getAvailableLocalesForPost
  // and also added via the fallback
  const uniqueEntries = Array.from(new Set(entriesList.map(e => JSON.stringify(e))))
                         .map(s => JSON.parse(s));

  return uniqueEntries;
};