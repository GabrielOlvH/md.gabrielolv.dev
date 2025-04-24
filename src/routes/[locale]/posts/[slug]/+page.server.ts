import { getPostBySlug } from "$lib/utils/posts";
import { error } from "@sveltejs/kit";
import { getLocaleFromFilename, getOriginalSlug } from "$lib/i18n";
import { markdownToHtml } from "$lib/utils/markdown";
import type { PageServerLoad } from "./$types";

// Use the same glob as in your posts utility
const postsGlob = import.meta.glob("/posts/*.md", { as: "raw" });

export const load: PageServerLoad = async ({ params }) => {
  const { locale, slug } = params;

  // Get the post content
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    throw error(404, "Post not found");
  }

  // Convert markdown to HTML
  const htmlContent = markdownToHtml(post.content);

  // Find all available locales for this post
  const availableLocales = Object.keys(postsGlob)
    .map((filePath) => {
      const filename = filePath.split("/").pop();
      if (!filename) return null;
      const fileSlug = getOriginalSlug(filename.replace(/\.mdx?$/, ""));
      if (fileSlug !== slug) return null;
      const fileLocale = getLocaleFromFilename(filename);
      return fileLocale || "en";
    })
    .filter((locale): locale is string => Boolean(locale));

  // Make sure the list is unique
  const uniqueLocales = [...new Set(availableLocales)];

  return {
    post: post.metadata,
    content: htmlContent,
    availableLocales: uniqueLocales
  };
};
