import { getAllPosts } from '$lib/utils/posts';
import type { PageServerLoad } from '../../../../.svelte-kit/types/src/routes/[locale]/$types';

export const load: PageServerLoad = async ({ params }) => {
  const { locale } = params;
  const posts = await getAllPosts(locale);

  return {
    posts
  };
};
