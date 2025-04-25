import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.platform?.env?.BLOG_ANALYTICS) {
		event.locals.blogAnalytics = {
			writeDataPoint: true
		};
	}

	return resolve(event);
};
