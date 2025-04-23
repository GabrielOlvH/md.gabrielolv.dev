import { getPostBySlug } from '$lib/utils/posts';
import { error } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { getLocaleFromFilename, getOriginalSlug } from '$lib/i18n';
import { markdownToHtml } from '$lib/utils/markdown';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { locale, slug } = params;
  
  // Get the post content
  const post = await getPostBySlug(slug, locale);
  
  if (!post) {
    throw error(404, 'Post not found');
  }
  
  // Convert markdown to HTML
  const htmlContent = markdownToHtml(post.content);
  
  // Check for available translations
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);
  
  // Find all available locales for this post
  const availableLocales = filenames
    .filter(filename => {
      const fileSlug = getOriginalSlug(filename.replace(/\.mdx?$/, ''));
      return fileSlug === slug;
    })
    .map(filename => {
      const fileLocale = getLocaleFromFilename(filename);
      return fileLocale || 'en'; // Default to 'en' if no locale suffix
    });
  
  // Make sure the list is unique
  const uniqueLocales = [...new Set(availableLocales)];
  
  return {
    post: post.metadata,
    content: htmlContent,
    availableLocales: uniqueLocales
  };
};
