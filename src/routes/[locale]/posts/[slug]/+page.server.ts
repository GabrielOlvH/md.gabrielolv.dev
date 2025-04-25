import { getAvailableLocalesForPost, getPostBySlug } from "$lib/utils/posts";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ params }) => {
  const { locale, slug } = params;

  const post = await getPostBySlug(slug, locale);

  if (!post) {
    throw error(404, "Post not found");
  }

  // Get all available locales for this post using the new utility
  const availableLocales = await getAvailableLocalesForPost(slug);

  return {
    post: post.metadata,
    content: post.content,
    items: post.toc,
    availableLocales
  }
};
