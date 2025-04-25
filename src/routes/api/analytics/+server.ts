import type { RequestHandler } from '@sveltejs/kit';
export const POST: RequestHandler = async({ request, platform }) => {
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

    // Write data point to Cloudflare Analytics Engine
    platform.env.BLOG_ANALYTICS.writeDataPoint({
      blobs: data.blobs,
      doubles: data.doubles,
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
