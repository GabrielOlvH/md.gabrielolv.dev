<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  
  // Terminal state
  const showCursor = writable(true);
  let input = '';
  let inputElement;
  let isActive = false;
  
  // Get current path from URL
  $: currentPath = $page.url.pathname.replace(`/${$page.params.locale}`, '') || '/';
  
  // Handle command execution
  async function executeCommand(cmd) {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;
    
    // Parse command
    const parts = trimmedCmd.split(' ');
    const command = parts[0];
    const args = parts.slice(1);
    
    // Execute command
    if (command === 'cd' && args[0]) {
      // Navigate to path
      let path = args[0];
      
      // Handle relative paths
      if (path === '..') {
        const segments = currentPath.split('/').filter(segment => segment.length > 0);
        segments.pop();
        path = '/' + segments.join('/');
      } else if (!path.startsWith('/')) {
        path = currentPath === '/' ? '/' + path : currentPath + '/' + path;
      }
      
      // Clean up path
      path = path.replace(/\/+/g, '/');
      
      // Navigate
      goto(`/${$page.params.locale}${path}`);
    } else if (command === 'home') {
      // Go to home
      goto(`/${$page.params.locale}`);
    } else if (command === 'about') {
      // Go to about
      goto(`/${$page.params.locale}/about`);
    } else if (command === 'terminal') {
      // Go to terminal
      goto(`/${$page.params.locale}/terminal-home`);
    } else {
      // Try to navigate directly
      goto(`/${$page.params.locale}/${command}`);
    }
    
    // Clear input
    input = '';
    isActive = false;
  }
  
  // Handle keyboard events
  function handleKeydown(event) {
    if (event.key === 'Enter') {
      executeCommand(input);
    } else if (event.key === 'Escape') {
      isActive = false;
      input = '';
    }
  }
  
  // Focus the input when activated
  function activateTerminal() {
    isActive = true;
    tick().then(() => {
      inputElement?.focus();
    });
  }
  
  // Blink cursor
  function startCursorBlink() {
    setInterval(() => {
      $showCursor = !$showCursor;
    }, 500);
  }
  
  onMount(() => {
    // Start cursor blink
    startCursorBlink();
  });
</script>

<div 
  class="terminal-header-container {isActive ? 'active' : ''}"
  on:click={activateTerminal}
>
  <div class="terminal-prompt">
    <span class="domain">md.gabrielolv.dev</span>
    <span class="path">{currentPath}</span>
    {#if isActive}
      <input 
        type="text" 
        class="terminal-input" 
        bind:value={input} 
        bind:this={inputElement}
        on:keydown={handleKeydown}
        on:blur={() => isActive = false}
        autocomplete="off"
        spellcheck="false"
        placeholder="Type a command..."
      >
      {#if $showCursor}
        <span class="cursor">█</span>
      {/if}
    {:else}
      <span class="cursor-placeholder">█</span>
    {/if}
  </div>
</div>

<style>
  .terminal-header-container {
    background-color: #282c34;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: text;
    transition: all 0.2s ease;
    border: 1px solid #3e4451;
    width: 100%;
  }
  
  .terminal-header-container.active {
    border-color: #61afef;
    box-shadow: 0 0 0 2px rgba(97, 175, 239, 0.2);
  }
  
  .terminal-prompt {
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  
  .domain {
    color: #61afef;
  }
  
  .path {
    color: #98c379;
  }
  
  .terminal-input {
    background: transparent;
    border: none;
    color: #abb2bf;
    font-family: inherit;
    font-size: inherit;
    outline: none;
    flex: 1;
    margin-left: 4px;
    caret-color: transparent;
    width: 100%;
  }
  
  .cursor, .cursor-placeholder {
    color: #abb2bf;
    margin-left: 4px;
  }
  
  .cursor {
    animation: blink 1s step-end infinite;
  }
  
  .cursor-placeholder {
    opacity: 0.5;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
</style>
