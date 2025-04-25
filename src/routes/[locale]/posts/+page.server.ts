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

export const ssr = true;
export const csr = true;
export const trailingSlash = 'never';
export const prerender = false;