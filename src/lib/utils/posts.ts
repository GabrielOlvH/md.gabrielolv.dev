import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { defaultLocale, getLocaleFromFilename, getOriginalSlug } from '$lib/i18n';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the posts directory path
const postsDirectory = path.join(process.cwd(), 'posts');

// Interface for post metadata
export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: number;
  locale: string;
}

// Function to estimate reading time
function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Function to parse markdown frontmatter
function parseFrontmatter(content: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(content);
  
  if (!match) {
    return { 
      frontmatter: { title: 'Untitled', date: new Date().toISOString(), excerpt: '', tags: [] },
      content 
    };
  }
  
  const frontmatterBlock = match[1];
  const contentWithoutFrontmatter = content.replace(frontmatterRegex, '').trim();
  
  // Parse frontmatter
  const frontmatter: Record<string, any> = {};
  frontmatterBlock.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      let value = valueParts.join(':').trim();
      
      // Handle arrays (like tags)
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => item.trim());
      }
      
      frontmatter[key.trim()] = value;
    }
  });
  
  return { frontmatter, content: contentWithoutFrontmatter };
}

// Function to get all posts for a specific locale
export async function getAllPosts(locale: string): Promise<PostMetadata[]> {
  // Ensure posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const filenames = fs.readdirSync(postsDirectory);
  
  // Filter posts based on the current locale
  const localePosts = filenames.filter(filename => {
    // Check if the file has a locale suffix matching the current locale
    const fileLocale = getLocaleFromFilename(filename);
    
    // Include files that match the current locale or have no locale suffix (for default locale)
    return (fileLocale === locale) || 
           (fileLocale === null && locale === defaultLocale);
  });
  
  const posts = await Promise.all(localePosts.map(async (filename) => {
    // Get the slug without locale suffix and file extension
    const originalFilename = filename.replace(/\.mdx?$/, '');
    const slug = getOriginalSlug(originalFilename);
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');
    
    // Parse frontmatter
    const { frontmatter, content } = parseFrontmatter(fileContents);
    
    // Calculate reading time
    const readingTime = estimateReadingTime(content);
    
    // Format date
    const date = frontmatter.date 
      ? new Date(frontmatter.date).toISOString()
      : new Date().toISOString();
    
    return { 
      slug, 
      title: frontmatter.title || slug,
      date,
      readingTime,
      tags: frontmatter.tags || [],
      excerpt: frontmatter.excerpt || content.substring(0, 150) + '...',
      locale: locale
    };
  }));
  
  // Sort posts by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Function to get a single post by slug
export async function getPostBySlug(slug: string, locale: string): Promise<{ metadata: PostMetadata, content: string } | null> {
  // Ensure posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }
  
  const filenames = fs.readdirSync(postsDirectory);
  
  // Find the file that matches the slug and locale
  const filename = filenames.find(name => {
    const fileSlug = getOriginalSlug(name.replace(/\.mdx?$/, ''));
    const fileLocale = getLocaleFromFilename(name);
    
    return fileSlug === slug && (
      (fileLocale === locale) || 
      (fileLocale === null && locale === defaultLocale)
    );
  });
  
  if (!filename) {
    return null;
  }
  
  const fullPath = path.join(postsDirectory, filename);
  const fileContents = fs.readFileSync(fullPath, 'utf-8');
  
  // Parse frontmatter
  const { frontmatter, content } = parseFrontmatter(fileContents);
  
  // Calculate reading time
  const readingTime = estimateReadingTime(content);
  
  // Format date
  const date = frontmatter.date 
    ? new Date(frontmatter.date).toISOString()
    : new Date().toISOString();
  
  const metadata: PostMetadata = { 
    slug, 
    title: frontmatter.title || slug,
    date,
    readingTime,
    tags: frontmatter.tags || [],
    excerpt: frontmatter.excerpt || content.substring(0, 150) + '...',
    locale
  };
  
  return { metadata, content };
}
