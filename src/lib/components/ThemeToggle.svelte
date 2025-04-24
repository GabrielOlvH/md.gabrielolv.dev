<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let theme: 'light' | 'dark' = 'light';
  let spinDirection: 'left' | 'right' = 'right';
  let spin = false;
  
  function triggerSpin(duration: number) {
    spin = true;
    setTimeout(() => (spin = false), duration);
  }
  
  function toggleTheme() {
    // Toggle the theme
    theme = theme === 'light' ? 'dark' : 'light';
    
    // Set spin direction based on which theme we're switching to
    spinDirection = theme === 'dark' ? 'right' : 'left';
    
    // Trigger animation
    triggerSpin(650);
    
    // Update the theme
    updateTheme();
  }
  
  function updateTheme() {
    if (!browser) return;
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }
  
  function isDarkMode() {
    if (!browser) return false;
    
    // Check localStorage first
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  onMount(() => {
    // Initialize theme based on stored preference or system preference
    theme = isDarkMode() ? 'dark' : 'light';
    updateTheme();
    
    // Listen for system preference changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        // Only update if user hasn't explicitly set a preference
        if (!localStorage.getItem('theme')) {
          theme = e.matches ? 'dark' : 'light';
          updateTheme();
        }
      });
  });
</script>

<button
  aria-label="Toggle theme"
  class="rounded-md p-2 text-green-700 hover:bg-green-100 hover:text-green-800 dark:text-green-300 dark:hover:bg-green-800 dark:hover:text-green-200 transition-colors"
  on:click={toggleTheme}
>
  <div 
    class="icon"
    class:spin-left={spin && spinDirection === "left"}
    class:spin-right={spin && spinDirection === "right"}
  >
    {#if theme === 'dark'}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    {/if}
  </div>
</button>

<style lang="scss">
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    outline: 0;
    border-radius: 0.375rem;
    transition: background-color 0.2s ease, color 0.2s ease;
  }
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Animation styles */
  .spin-right {
    animation: spin-right 575ms cubic-bezier(0.075, 0.82, 0.17, 1.135);
  }
  
  .spin-left {
    animation: spin-left 575ms cubic-bezier(0.075, 0.82, 0.17, 1.135);
  }
  
  @keyframes spin-right {
    0% {
      transform: scale(0) rotate(0deg);
    }
    100% {
      transform: scale(1) rotate(720deg);
    }
  }
  
  @keyframes spin-left {
    0% {
      transform: scale(0) rotate(0deg);
    }
    100% {
      transform: scale(1) rotate(-720deg);
    }
  }
</style>
