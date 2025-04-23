<script lang="ts">
	import '../app.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import LanguageToggle from '$lib/components/LanguageToggle.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen bg-green-50/50 dark:bg-green-950">
	<div class="fixed top-4 right-4 z-50 flex space-x-2">
		<ThemeToggle />
		<LanguageToggle />
	</div>
	
	<div class="bg-gradient-animation"></div>
	
	{@render children()}
</div>
