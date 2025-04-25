<script lang="ts">
	import '../app.css';
	import LanguageToggle from '$lib/components/LanguageToggle.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let { children } = $props();

	// Track page views with Cloudflare Analytics Engine
	onMount(() => {
		if (browser) {
			trackPageView();
			
			// Track page changes for SPA navigation
			const unsubscribe = page.subscribe(() => {
				trackPageView();
			});
			
			return unsubscribe;
		}
	});
	
	async function trackPageView() {
		// Only run in browser environment
		if (browser) {
			try {
				// Collect analytics data
				const analyticsData = {
					blobs: [
						location.pathname,                // Path
						document.referrer || 'direct',    // Referrer
						navigator.language,               // User language
						window.innerWidth <= 768 ? 'mobile' : 'desktop' // Device type
					],
					doubles: [
						1, // Count (for aggregation)
						performance.now() // Page load time
					],
					indexes: [
						crypto.randomUUID() // Unique ID for sampling
					]
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
	<div class="fixed top-4 right-4 z-50 flex space-x-2">
		<LanguageToggle />
	</div>

	
	{@render children()}
</div>
