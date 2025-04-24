import { getAllPosts } from '$lib/utils/posts';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  // Get all posts for both languages
  const enPosts = await getAllPosts('en');
  const ptPosts = await getAllPosts('pt');
  
  // Base URL for the site
  const baseUrl = 'https://md.gabrielolv.dev';
  
  // Current date for lastmod
  const today = new Date().toISOString().split('T')[0];
  
  // Start building the sitemap
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- Home pages -->
  <url>
    <loc>${baseUrl}/en</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en" />
    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/pt" />
  </url>
  
  <url>
    <loc>${baseUrl}/pt</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/pt" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en" />
  </url>
  
  <!-- About pages -->
  <url>
    <loc>${baseUrl}/en/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/about" />
    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/pt/about" />
  </url>
  
  <url>
    <loc>${baseUrl}/pt/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/pt/about" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/about" />
  </url>
  
  <!-- Contact pages -->
  <url>
    <loc>${baseUrl}/en/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/contact" />
    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/pt/contact" />
  </url>
  
  <url>
    <loc>${baseUrl}/pt/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/pt/contact" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/contact" />
  </url>`;
  
  // Add all posts to the sitemap
  for (const post of enPosts) {
    // Find if there's a corresponding PT version
    const ptVersion = ptPosts.find(p => p.slug === post.slug);
    
    sitemap += `
  
  <url>
    <loc>${baseUrl}/en/posts/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/posts/${post.slug}" />
    ${ptVersion ? `<xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/pt/posts/${post.slug}" />` : ''}
  </url>`;
  }
  
  // Add PT posts that don't have an EN version
  for (const post of ptPosts) {
    // Check if this post already has an EN version (already added)
    const enVersion = enPosts.find(p => p.slug === post.slug);
    if (!enVersion) {
      sitemap += `
  
  <url>
    <loc>${baseUrl}/pt/posts/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/pt/posts/${post.slug}" />
  </url>`;
    }
  }
  
  // Close the sitemap
  sitemap += `
</urlset>`;
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600'
    }
  });
};
