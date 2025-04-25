<script lang="ts">
	import '../app.css';
	import SEO from '$lib/components/SEO.svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let { children } = $props();
	let visitorId: string;
	let viewedPages: Set<string> = new Set();

	// Track page views with Cloudflare Analytics Engine
	onMount(() => {
		if (browser) {
			// Generate or retrieve visitor ID for unique view tracking
			initVisitorTracking();

			// Track initial page view
			trackPageView();

			// Track page changes for SPA navigation
			const unsubscribe = page.subscribe((newPage) => {
				trackPageView();
			});

			return unsubscribe;
		}
	});

	function initVisitorTracking() {
		// Try to get existing visitor ID from localStorage
		const storedVisitorId = localStorage.getItem('blog_visitor_id');

		if (storedVisitorId) {
			visitorId = storedVisitorId;

			// Load previously viewed pages
			try {
				const viewedPagesJson = localStorage.getItem('blog_viewed_pages');
				if (viewedPagesJson) {
					viewedPages = new Set(JSON.parse(viewedPagesJson));
				}
			} catch (e) {
				console.error('Failed to load viewed pages:', e);
				viewedPages = new Set();
			}
		} else {
			// Generate new visitor ID
			visitorId = crypto.randomUUID();
			localStorage.setItem('blog_visitor_id', visitorId);
		}
	}

	async function trackPageView() {
		// Only run in browser environment
		if (browser) {
			try {
				const currentPath = location.pathname;

				// Check if this is a unique page view for this visitor
				const isUnique = !viewedPages.has(currentPath);

				// Mark page as viewed
				if (isUnique) {
					viewedPages.add(currentPath);
					localStorage.setItem('blog_viewed_pages', JSON.stringify([...viewedPages]));
				}

				// Collect analytics data
				const analyticsData = {
					blobs: [
						currentPath,                      // Path
						document.referrer || 'direct',    // Referrer
						navigator.language,               // User language
						window.innerWidth <= 768 ? 'mobile' : 'desktop' // Device type
					],
					doubles: [
						1, // Count (for aggregation)
						performance.now() // Page load time
					],
					indexes: [
						visitorId // Use visitor ID for sampling
					],
					visitorId,
					isUnique
				};
				
				// Send analytics data to our API endpoint
				await fetch('/api/analytics', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(analyticsData),
					// Don't wait for response to avoid blocking
					keepalive: true
				});
			} catch (error) {
				console.error('Failed to track page view:', error);
			}
		}
	}
</script>

<SEO />

<svelte:head>
	
	<!-- Add Fira Code font for terminal -->
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fira-code@6.2.0/distr/fira_code.css">
	<style>
		:root {
			--font-mono: 'Fira Code', monospace;
		}
	</style>
</svelte:head>

<div class="min-h-screen">
	{@render children()}
</div>
