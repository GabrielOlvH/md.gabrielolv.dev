<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  
  // Terminal state
  const currentPath = writable('/');
  const commandHistory = writable([]);
  const historyIndex = writable(-1);
  const showCursor = writable(true);
  
  // Directory structure (this would be dynamically generated in a real app)
  const fileSystem = {
    '/': {
      type: 'directory',
      children: {
        'about': { type: 'directory', lastModified: '2025-04-20', children: {} },
        'blog': { type: 'directory', lastModified: '2025-04-22', children: {} },
        'projects': { 
          type: 'directory', 
          lastModified: '2025-04-18',
          children: {
            'web': { type: 'directory', lastModified: '2025-04-15', children: {} },
            'mobile': { type: 'directory', lastModified: '2025-04-10', children: {} },
            'experiments': { type: 'directory', lastModified: '2025-04-05', children: {} },
            'archive': { type: 'directory', lastModified: '2025-03-20', children: {} },
            'README.md': { type: 'file', size: '2.4 KB', lastModified: '2025-04-01', content: '# Projects\n\nThis directory contains various projects I\'ve worked on.\n\n## Categories\n\n- Web: Web development projects\n- Mobile: Mobile app development\n- Experiments: Experimental projects and prototypes\n- Archive: Older projects' }
          }
        },
        'resume.pdf': { type: 'file', size: '1.2 MB', lastModified: '2025-04-15' },
        '.hidden': { type: 'directory', lastModified: '2025-04-10', children: {
          '.secret.txt': { type: 'file', size: '128 B', lastModified: '2025-04-10', content: 'You found a secret file! Congratulations on your curiosity.' }
        }}
      }
    }
  };
  
  // Current input
  let input = '';
  let inputElement;
  let terminalElement;
  let outputLines = [];
  
  // Current directory content
  let currentDirContent = [];
  
  // Parse path to get file system object
  function getPathObject(path) {
    const segments = path.split('/').filter(segment => segment.length > 0);
    let current = fileSystem['/'];
    
    for (const segment of segments) {
      if (current.type !== 'directory' || !current.children[segment]) {
        return null;
      }
      current = current.children[segment];
    }
    
    return current;
  }
  
  // Get directory content
  function getDirContent(path) {
    const pathObj = getPathObject(path);
    if (!pathObj || pathObj.type !== 'directory') return [];
    
    return Object.entries(pathObj.children).map(([name, info]) => ({
      name,
      type: info.type,
      size: info.size || '',
      lastModified: info.lastModified || '',
      isHidden: name.startsWith('.')
    }));
  }
  
  // Update directory content based on current path
  function updateDirContent() {
    currentDirContent = getDirContent($currentPath);
  }
  
  // Handle command execution
  async function executeCommand(cmd) {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;
    
    // Add to history
    $commandHistory = [...$commandHistory, trimmedCmd];
    $historyIndex = -1;
    
    // Parse command
    const parts = trimmedCmd.split(' ');
    const command = parts[0];
    const args = parts.slice(1);
    
    // Execute command
    switch (command) {
      case 'cd':
        handleCd(args[0]);
        break;
      case 'ls':
        handleLs(args);
        break;
      case 'cat':
        handleCat(args[0]);
        break;
      case 'clear':
        outputLines = [];
        break;
      case 'help':
        showHelp();
        break;
      default:
        if (command.endsWith('/')) {
          // Treat as directory navigation
          handleCd(command);
        } else {
          outputLines = [...outputLines, { type: 'error', content: `Command not found: ${command}` }];
        }
    }
    
    // Clear input
    input = '';
    await tick();
    inputElement.focus();
    
    // Scroll to bottom
    terminalElement.scrollTop = terminalElement.scrollHeight;
  }
  
  // Handle cd command
  function handleCd(path) {
    if (!path) {
      outputLines = [...outputLines, { type: 'error', content: 'cd: missing operand' }];
      return;
    }
    
    let newPath;
    
    if (path === '..') {
      // Go up one level
      const segments = $currentPath.split('/').filter(segment => segment.length > 0);
      segments.pop();
      newPath = '/' + segments.join('/');
      if (!newPath.endsWith('/')) newPath += '/';
    } else if (path.startsWith('/')) {
      // Absolute path
      newPath = path;
    } else {
      // Relative path
      newPath = $currentPath + (path.endsWith('/') ? path : path + '/');
    }
    
    // Clean up path
    newPath = newPath.replace(/\/+/g, '/');
    if (newPath !== '/' && newPath.endsWith('/')) {
      newPath = newPath.slice(0, -1);
    }
    
    // Check if path exists
    const pathObj = getPathObject(newPath);
    if (!pathObj) {
      outputLines = [...outputLines, { type: 'error', content: `cd: ${path}: No such file or directory` }];
      return;
    }
    
    if (pathObj.type !== 'directory') {
      outputLines = [...outputLines, { type: 'error', content: `cd: ${path}: Not a directory` }];
      return;
    }
    
    // Update path and navigate
    $currentPath = newPath;
    updateDirContent();
    
    // Update URL
    const urlPath = newPath === '/' ? '' : newPath;
    goto(`/${$page.params.locale}${urlPath}`);
  }
  
  // Handle ls command
  function handleLs(args) {
    const showHidden = args.includes('-a') || args.includes('--all');
    const showDetails = args.includes('-l');
    
    let items = currentDirContent;
    if (!showHidden) {
      items = items.filter(item => !item.isHidden);
    }
    
    if (showDetails) {
      // Display detailed listing
      outputLines = [...outputLines, { type: 'output', content: 'Type  Name             Size      Modified' }];
      outputLines = [...outputLines, { type: 'output', content: '----  ---------------  --------  ----------' }];
      
      items.forEach(item => {
        const typeChar = item.type === 'directory' ? 'd' : '-';
        const name = item.name + (item.type === 'directory' ? '/' : '');
        const size = item.size || '';
        const modified = item.lastModified || '';
        
        outputLines = [...outputLines, { 
          type: 'output', 
          content: `${typeChar}     ${name.padEnd(15)} ${size.padEnd(8)} ${modified}`,
          itemType: item.type
        }];
      });
    } else {
      // Display simple listing
      const content = items.map(item => ({
        content: item.name + (item.type === 'directory' ? '/' : ''),
        itemType: item.type
      }));
      
      outputLines = [...outputLines, { type: 'ls', content }];
    }
  }
  
  // Handle cat command
  function handleCat(filename) {
    if (!filename) {
      outputLines = [...outputLines, { type: 'error', content: 'cat: missing operand' }];
      return;
    }
    
    // Get file path
    const path = $currentPath === '/' 
      ? '/' + filename 
      : $currentPath + '/' + filename;
    
    const pathObj = getPathObject(path);
    
    if (!pathObj) {
      outputLines = [...outputLines, { type: 'error', content: `cat: ${filename}: No such file or directory` }];
      return;
    }
    
    if (pathObj.type !== 'file') {
      outputLines = [...outputLines, { type: 'error', content: `cat: ${filename}: Is a directory` }];
      return;
    }
    
    // Display file content
    outputLines = [...outputLines, { type: 'file', content: pathObj.content || 'Empty file' }];
  }
  
  // Show help
  function showHelp() {
    outputLines = [...outputLines, { type: 'output', content: 'Available commands:' }];
    outputLines = [...outputLines, { type: 'output', content: '  cd [directory]    Change directory' }];
    outputLines = [...outputLines, { type: 'output', content: '  ls [-a] [-l]      List directory contents' }];
    outputLines = [...outputLines, { type: 'output', content: '  cat [file]        Display file contents' }];
    outputLines = [...outputLines, { type: 'output', content: '  clear             Clear the terminal' }];
    outputLines = [...outputLines, { type: 'output', content: '  help              Show this help message' }];
  }
  
  // Handle keyboard navigation
  function handleKeydown(event) {
    if (event.key === 'Enter') {
      executeCommand(input);
    } else if (event.key === 'ArrowUp') {
      // Navigate history up
      if ($commandHistory.length > 0 && $historyIndex < $commandHistory.length - 1) {
        $historyIndex += 1;
        input = $commandHistory[$commandHistory.length - 1 - $historyIndex];
      }
    } else if (event.key === 'ArrowDown') {
      // Navigate history down
      if ($historyIndex > 0) {
        $historyIndex -= 1;
        input = $commandHistory[$commandHistory.length - 1 - $historyIndex];
      } else if ($historyIndex === 0) {
        $historyIndex = -1;
        input = '';
      }
    } else if (event.key === 'Tab') {
      // Tab completion
      event.preventDefault();
      if (input.trim()) {
        const lastWord = input.split(' ').pop();
        const matches = currentDirContent
          .filter(item => item.name.startsWith(lastWord))
          .map(item => item.name + (item.type === 'directory' ? '/' : ''));
        
        if (matches.length === 1) {
          // Complete the input
          const parts = input.split(' ');
          parts.pop();
          parts.push(matches[0]);
          input = parts.join(' ');
        } else if (matches.length > 1) {
          // Show possible completions
          outputLines = [...outputLines, { type: 'output', content: `${input}` }];
          outputLines = [...outputLines, { type: 'ls', content: matches.map(m => ({ content: m, itemType: m.endsWith('/') ? 'directory' : 'file' })) }];
        }
      }
    }
  }
  
  // Handle directory item click
  function handleItemClick(item) {
    if (item.type === 'directory') {
      handleCd(item.name);
    } else {
      handleCat(item.name);
    }
  }
  
  // Blink cursor
  function startCursorBlink() {
    setInterval(() => {
      $showCursor = !$showCursor;
    }, 500);
  }
  
  // Initialize terminal
  onMount(() => {
    // Set initial path based on URL
    const urlPath = $page.url.pathname.replace(`/${$page.params.locale}`, '') || '/';
    $currentPath = urlPath;
    updateDirContent();
    
    // Focus input
    inputElement.focus();
    
    // Start cursor blink
    startCursorBlink();
    
    // Initial directory listing
    handleLs([]);
  });
</script>

<div class="terminal-container">
  <div class="terminal-header">
    <div class="terminal-buttons">
      <div class="terminal-button close"></div>
      <div class="terminal-button minimize"></div>
      <div class="terminal-button maximize"></div>
    </div>
    <div class="terminal-title">Terminal</div>
  </div>
  
  <div class="terminal" bind:this={terminalElement}>
    <!-- Output lines -->
    {#each outputLines as line}
      {#if line.type === 'output'}
        <div class="terminal-line output">
          <span class={line.itemType ? `item-${line.itemType}` : ''}>{line.content}</span>
        </div>
      {:else if line.type === 'error'}
        <div class="terminal-line error">{line.content}</div>
      {:else if line.type === 'ls'}
        <div class="terminal-line ls-output">
          {#each line.content as item}
            <span 
              class="ls-item item-{item.itemType}" 
              on:click={() => handleItemClick({ name: item.content.replace('/', ''), type: item.itemType })}
            >
              {item.content}
            </span>
          {/each}
        </div>
      {:else if line.type === 'file'}
        <div class="terminal-line file-content">{@html line.content.replace(/\n/g, '<br>')}</div>
      {/if}
    {/each}
    
    <!-- Command prompt -->
    <div class="terminal-line prompt">
      <span class="prompt-text">md.gabrielolv.dev{$currentPath === '/' ? '' : $currentPath}</span>
      <span class="prompt-sign">$</span>
      <input 
        type="text" 
        class="terminal-input" 
        bind:value={input} 
        bind:this={inputElement}
        on:keydown={handleKeydown}
        autocomplete="off"
        spellcheck="false"
      >
      {#if $showCursor}
        <span class="cursor">█</span>
      {/if}
    </div>
    
    <!-- Directory listing -->
    {#if !outputLines.length}
      <div class="directory-listing">
        {#each currentDirContent.filter(item => !item.isHidden) as item}
          <div 
            class="directory-item item-{item.type}" 
            on:click={() => handleItemClick(item)}
          >
            {item.name}{item.type === 'directory' ? '/' : ''}
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  <!-- Breadcrumb navigation -->
  <div class="breadcrumb-nav">
    {#if $currentPath !== '/'}
      {@const segments = $currentPath.split('/').filter(s => s)}
      <span class="breadcrumb-item" on:click={() => handleCd('/')}>~</span>
      {#each segments as segment, i}
        <span class="breadcrumb-separator">/</span>
        <span 
          class="breadcrumb-item" 
          on:click={() => handleCd('/' + segments.slice(0, i + 1).join('/'))}
        >
          {segment}
        </span>
      {/each}
    {:else}
      <span class="breadcrumb-item active">~</span>
    {/if}
  </div>
</div>

<style>
  .terminal-container {
    width: 100%;
    height: 100%;
    background-color: #1e2127;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
  }
  
  .terminal-header {
    background-color: #21252b;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #181a1f;
  }
  
  .terminal-buttons {
    display: flex;
    gap: 8px;
    margin-right: 12px;
  }
  
  .terminal-button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
  .close {
    background-color: #ff5f56;
  }
  
  .minimize {
    background-color: #ffbd2e;
  }
  
  .maximize {
    background-color: #27c93f;
  }
  
  .terminal-title {
    color: #abb2bf;
    font-size: 14px;
    font-weight: 500;
  }
  
  .terminal {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
    color: #abb2bf;
  }
  
  .terminal-line {
    margin-bottom: 8px;
    word-break: break-word;
  }
  
  .prompt {
    display: flex;
    align-items: center;
  }
  
  .prompt-text {
    color: #61afef;
    margin-right: 8px;
  }
  
  .prompt-sign {
    color: #98c379;
    margin-right: 8px;
  }
  
  .terminal-input {
    background: transparent;
    border: none;
    color: #abb2bf;
    font-family: inherit;
    font-size: inherit;
    outline: none;
    flex: 1;
    caret-color: transparent;
  }
  
  .cursor {
    color: #abb2bf;
    animation: blink 1s step-end infinite;
    margin-left: 1px;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  
  .output {
    color: #abb2bf;
  }
  
  .error {
    color: #e06c75;
  }
  
  .ls-output {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .ls-item {
    cursor: pointer;
    transition: color 0.2s;
  }
  
  .ls-item:hover {
    text-decoration: underline;
  }
  
  .item-directory {
    color: #61afef;
  }
  
  .item-file {
    color: #abb2bf;
  }
  
  .file-content {
    color: #98c379;
    white-space: pre-wrap;
  }
  
  .directory-listing {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
  }
  
  .directory-item {
    cursor: pointer;
    transition: transform 0.2s;
    padding: 4px 8px;
    border-radius: 4px;
  }
  
  .directory-item:hover {
    background-color: rgba(171, 178, 191, 0.1);
    transform: translateX(4px);
  }
  
  .breadcrumb-nav {
    padding: 8px 16px;
    background-color: #21252b;
    border-top: 1px solid #181a1f;
    display: flex;
    align-items: center;
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .breadcrumb-item {
    color: #61afef;
    cursor: pointer;
  }
  
  .breadcrumb-item:hover {
    text-decoration: underline;
  }
  
  .breadcrumb-item.active {
    color: #98c379;
  }
  
  .breadcrumb-separator {
    color: #5c6370;
    margin: 0 4px;
  }
</style>
