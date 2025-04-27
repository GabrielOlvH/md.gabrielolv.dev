import type { RequestHandler } from '@sveltejs/kit';
type AnalyticsEventData = {
	blobs: string[];
	doubles: number[];
	indexes: number[];
	eventType?: string;
	visitorId?: string;
	isUnique?: boolean;
	eventData?: {
		scroll_direction_changes?: number;
		total_scroll_distance?: number;
		reached_end?: boolean;
		reached_middle?: boolean;
		milestone?: string;
		[key: string]: unknown; // for any extra eventData fields
	};
	[key: string]: unknown; // for any extra fields in the root object
};
export const POST: RequestHandler = async({ request, platform }) => {
  try {
    if (!platform?.env?.BLOG_ANALYTICS) {
      return new Response(JSON.stringify({ error: 'Analytics not available' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json() as AnalyticsEventData;
    
    // Validate required fields
    if (!data.blobs || !data.doubles || !data.indexes) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle different types of analytics events
    const eventType = data.eventType || 'page_view';
    const path = data.blobs[0] || '';
    const isUnique = data.isUnique || false;
    
    // Extract post slug if this is a post page
    const postSlug = extractPostSlug(path);
    
    // Add post slug to blobs if available and not already included
    if (postSlug && !data.blobs.includes(postSlug)) {
      data.blobs.push(postSlug);
    }
    
    // Handle standard page view
    if (eventType === 'page_view') {
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
    } 
    // Handle post-specific events
    else if (['post_view', 'post_milestone', 'post_engagement', 'reading_time_update', 'link_click', 'code_interaction'].includes(eventType)) {
      // Extract engagement metrics
      const timeSpent = data.doubles[1] || 0;
      const scrollPercentage = data.doubles[2] || 0;
      const interactionCount = data.doubles[3] || 0;
      
      // Additional metrics from eventData
      const eventData = data.eventData || {};
      const scrollDirectionChanges = eventData.scroll_direction_changes || 0;
      const totalScrollDistance = eventData.total_scroll_distance || 0;
      const reachedEnd = eventData.reached_end ? 1 : 0;
      const reachedMiddle = eventData.reached_middle ? 1 : 0;
      const milestone = eventData.milestone || '';
      
      // Write post engagement data points
      platform.env.BLOG_ANALYTICS.writeDataPoint({
        blobs: [
          path,                      // URL path
          eventType,                 // Type of event
          postSlug || '',            // Post slug
          milestone,                 // Milestone (middle, end, etc.)
          data.blobs[4] || ''        // User language
        ],
        doubles: [
          1,                         // Count
          timeSpent,                 // Time spent in seconds
          scrollPercentage,          // Max scroll percentage
          interactionCount,          // Number of interactions
          scrollDirectionChanges,    // Number of scroll direction changes
          totalScrollDistance,       // Total scroll distance
          reachedMiddle,             // Reached middle of article (1 or 0)
          reachedEnd                 // Reached end of article (1 or 0)
        ],
        indexes: data.indexes
      });
    }
    // Handle any other custom events
    else {
      platform.env.BLOG_ANALYTICS.writeDataPoint({
        blobs: data.blobs,
        doubles: data.doubles,
        indexes: data.indexes
      });
    }

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
