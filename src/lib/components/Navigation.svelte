<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$lib/i18n/translations';
  
  export let currentPath: string = $page.url.pathname;
  export let pageTitle: string = 'md.gabrielolv.dev';
  
  function isActive(path: string): boolean {
    const currentPathSegments = currentPath.split('/');
    const pathSegments = path.split('/');
    
    // Check if the current path matches the nav item path
    // For the home path, we need to check if it's the root or /{locale}
    if (path === '/' || path === `/${$page.params.locale}`) {
      return currentPathSegments.length <= 2 || 
        (currentPathSegments.length === 3 && currentPathSegments[2] === '');
    }
    
    // For other paths, check if the current path includes the nav item path
    return currentPath.includes(path);
  }
</script>

<div class="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-green-800/30">
  <h1 class="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-0">{pageTitle}</h1>
  
  <nav class="nav-container">
    <ul class="nav-list">
      <li class="nav-item">
        <a 
          href="/{$page.params.locale}" 
          class="nav-link {isActive(`/${$page.params.locale}`) ? 'active' : ''}"
        >
          {$t('nav.home')}
        </a>
      </li>
      <li class="nav-item">
        <a 
          href="/{$page.params.locale}/about" 
          class="nav-link {isActive(`/${$page.params.locale}/about`) ? 'active' : ''}"
        >
          {$t('nav.about')}
        </a>
      </li>
      <li class="nav-item">
        <a 
          href="/{$page.params.locale}/terminal-home" 
          class="nav-link {isActive(`/${$page.params.locale}/terminal-home`) ? 'active' : ''}"
        >
          <span class="terminal-icon">$_</span> Terminal
        </a>
      </li>
    </ul>
  </nav>
</div>

<style>
  .nav-container {
    display: flex;
    justify-content: center;
  }
  
  .nav-list {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .nav-item {
    position: relative;
  }
  
  .nav-link {
    position: relative;
    display: inline-block;
    padding: 0.5rem 0;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease, border-color 0.2s ease;
    border-bottom: 2px solid transparent;
  }
  
  .nav-link:hover,
  .nav-link.active {
    color: #ffffff;
    border-color: rgba(76, 175, 80, 0.7);
  }
  
  .nav-link.active {
    font-weight: 600;
  }
  
  .terminal-icon {
    font-family: 'Fira Code', 'Courier New', monospace;
    margin-right: 4px;
    color: #4CAF50;
  }
</style>
