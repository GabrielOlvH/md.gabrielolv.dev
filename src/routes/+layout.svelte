<script lang="ts">
	import '../app.css';
	import SEO from '$lib/components/SEO.svelte';

	let { children } = $props();

</script>

<SEO />

<svelte:head>
	<style>
		:root {
			--font-mono: 'Fira Code', monospace;
		}
	</style>
</svelte:head>

<div class="min-h-screen">
	{@render children()}
</div>
