<script lang="ts">
	import '../app.css';
	import LanguageToggle from '$lib/components/LanguageToggle.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();
	
	onMount(() => {
		// Force dark mode
		document.documentElement.classList.add('dark');
		document.body.classList.add('dark');
	});
</script>

<svelte:head>
	<script>
		// Force dark mode on page load
		document.documentElement.classList.add('dark');
		document.body.classList.add('dark');
	</script>
</svelte:head>

<div class="min-h-screen bg-green-950">
	<div class="fixed top-4 right-4 z-50 flex space-x-2">
		<LanguageToggle />
	</div>
	
	<!-- Animated background elements -->
	<div class="bg-gradient-animation"></div>
	
	<!-- Floating particles -->
	<div class="particles-container">
		<div class="particle"></div>
		<div class="particle"></div>
		<div class="particle"></div>
		<div class="particle"></div>
		<div class="particle"></div>
		<div class="particle"></div>
	</div>
	
	<!-- Glowing lines -->
	<div class="glow-line"></div>
	<div class="glow-line"></div>
	<div class="glow-line"></div>
	
	{@render children()}
</div>
