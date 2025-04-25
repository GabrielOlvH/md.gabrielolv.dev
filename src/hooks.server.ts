import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async({ event, resolve }) => {
  // Make Cloudflare Analytics Engine binding available to the client
  if (event.platform?.env?.BLOG_ANALYTICS) {
    // Expose the binding to the client
    event.locals.blogAnalytics = {
      writeDataPoint: true // Just a flag to indicate the binding is available
    };
  }

  const response = await resolve(event);
  return response;
}
