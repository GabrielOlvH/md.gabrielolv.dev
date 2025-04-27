<script lang="ts">
  import { locale } from '$lib/i18n/translations';
  import { page } from '$app/state';

	$effect(() => {
		if (page.params.locale) {
			locale.set(page.params.locale);
		}
	})

  
  let { children } = $props();
</script>

{@render children()}
