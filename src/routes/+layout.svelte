<script lang="ts">
	import '../app.css';
	import LanguageToggle from '$lib/components/LanguageToggle.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { children } = $props();

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
