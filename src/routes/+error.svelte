<script>
  export let error;
  export let status;

  import { ArrowLeft } from 'lucide-svelte';
</script>

<svelte:head>
  <title>{status === 404 ? 'Page Not Found' : 'Error'} | md.gabrielolv.dev</title>
</svelte:head>

<main class="min-h-screen flex items-center justify-center px-4">
  <div class="max-w-md w-full text-center space-y-8">

      <div class="space-y-4">
        <h1 class="text-5xl font-bold text-white">404</h1>
        <h2 class="text-2xl font-medium text-gray-200">Page Not Found</h2>
        <p class="text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    <p>error: {error}</p>
    <p>status: {status}</p>

    <div class="pt-4">
      <a
        href="/"
        class="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-green-400
               600 rounded-lg  transition-colors duration-200"
      >
        <ArrowLeft class="h-4 w-4" />
        Return to Homepage
      </a>
    </div>
  </div>
</main>

<style>
</style>
