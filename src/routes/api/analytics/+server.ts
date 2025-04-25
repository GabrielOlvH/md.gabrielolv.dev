import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async({ request, platform, cookies }) => {
  try {
    if (!platform?.env?.BLOG_ANALYTICS) {
      return new Response(JSON.stringify({ error: 'Analytics not available' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.blobs || !data.doubles || !data.indexes) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle unique visitor tracking
    const visitorId = data.visitorId || '';
    const path = data.blobs[0] || '';
    const isUnique = data.isUnique || false;
    
    // Extract post slug if this is a post page
    const postSlug = extractPostSlug(path);
    
    // Add post slug to blobs if available
    if (postSlug) {
      data.blobs.push(postSlug); // Add post slug as an additional dimension
    }
    
    // Track both total views and unique views
    platform.env.BLOG_ANALYTICS.writeDataPoint({
      blobs: data.blobs,
      doubles: [
        data.doubles[0], // View count
        data.doubles[1], // Page load time
        isUnique ? 1 : 0, // Is this a unique view? (1 for yes, 0 for no)
        postSlug ? 1 : 0  // Is this a post view? (1 for yes, 0 for no)
      ],
      indexes: data.indexes
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process analytics' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Extract post slug from URL path
 * Example: /en/posts/my-post -> my-post
 */
function extractPostSlug(path: string): string | null {
  const match = path.match(/\/[^/]+\/posts\/([^/]+)/);
  return match ? match[1] : null;
}
