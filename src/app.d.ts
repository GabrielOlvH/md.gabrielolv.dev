// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: {
				BLOG_ANALYTICS: AnalyticsEngine;
				[key: string]: any;
			}
			cf: CfProperties
			ctx: ExecutionContext
		}
	}
}

interface AnalyticsEvent {
	eventType: 'page_view' | 'post_view' | 'post_milestone' | 'post_engagement' | 'reading_time_update' | 'link_click' | 'code_interaction' | 'resume_download';
	path: string;
	language?: string;
	doubles?: number[];
	blobs?: string[];
	isUnique?: boolean;
	postSlug?: string;
	visitorId?: string;
	eventData?: {
		milestone?: string;
		time_spent_seconds?: number;
		max_scroll_percentage?: number;
		scroll_direction_changes?: number;
		total_scroll_distance?: number;
		interaction_events?: number;
		reached_end?: boolean;
		reached_middle?: boolean;
		link_url?: string;
		link_text?: string;
		code_language?: string;
		[key: string]: any;
	};
}

export {};