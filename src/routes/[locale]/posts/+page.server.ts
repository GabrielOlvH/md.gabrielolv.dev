import { getAllPosts } from '$lib/utils/posts';
import type { PageServerLoad } from '../../../../.svelte-kit/types/src/routes/[locale]/$types';

export const load: PageServerLoad = async ({ params, depends }) => {
  const { locale } = params;
  
  // This tells SvelteKit to re-run this load function when the 'posts' dependency changes
  depends('posts');
  
  const posts = await getAllPosts(locale);

  return {
    posts
  };
};

// Add a dependency on the locale parameter to ensure data is reloaded when locale changes
export const ssr = true;
export const csr = true;
export const trailingSlash = 'never';
export const prerender = false;

// This is the key addition - it tells SvelteKit to track the locale parameter
// and reload the page data when it changes
