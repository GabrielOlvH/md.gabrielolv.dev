import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const robotsTxt = `# robots.txt for md.gabrielolv.dev
User-agent: *
Allow: /

# Sitemap
Sitemap: https://md.gabrielolv.dev/sitemap.xml

# Crawl delay
Crawl-delay: 10
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'max-age=3600'
    }
  });
};

export const prerender = true;
