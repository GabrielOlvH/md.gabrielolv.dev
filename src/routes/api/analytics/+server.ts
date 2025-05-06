import type { RequestHandler } from '@sveltejs/kit';

type AnalyticsEventData = {
  eventType: 'page_view' | 'post_view' | 'post_milestone' | 'post_engagement' | 'reading_time_update' | 'link_click' | 'code_interaction' | 'resume_download';
  path: string;
  language?: string;
  doubles?: number[];
  blobs?: string[];
  isUnique?: boolean;
  postSlug?: string;
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
    if (!data.eventType || !data.path) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle different types of analytics events
    const eventType = data.eventType;
    const isUnique = data.isUnique ?? false;
    const postSlug = data.postSlug;

    // Handle standard page view
    if (eventType === 'page_view') {
      platform.env.BLOG_ANALYTICS.writeDataPoint({
        blobs: [
          data.path,
          data.language || 'unknown',
          postSlug || '',
          eventType
        ],
        doubles: [
          data.doubles?.[0] || 1, // View count
          isUnique ? 1 : 0, // Is this a unique view? (1 for yes, 0 for no)
          postSlug ? 1 : 0  // Is this a post view? (1 for yes, 0 for no)
        ],
      });
    }
    // Handle post-specific events and resume downloads
    else if (['post_view', 'post_milestone', 'post_engagement', 'reading_time_update', 'link_click', 'code_interaction', 'resume_download'].includes(eventType)) {
      platform.env.BLOG_ANALYTICS.writeDataPoint({
        blobs: [
          data.path,
          data.language || 'unknown',
          data.blobs?.[0] || '',
          eventType
        ],
        doubles: [
          data.doubles?.[0] || 1,
          isUnique ? 1 : 0,
          1 // This is a tracked event
        ],
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