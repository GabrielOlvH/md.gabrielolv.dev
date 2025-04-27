<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { locale } from '$lib/i18n/translations';
  
  const supportedLocales = ['en', 'pt'];

  $effect(() => {
    const pathParts = page.url.pathname.split('/');
    const localeInPath = pathParts[1];

    if (supportedLocales.includes(localeInPath)) {
      locale.set(localeInPath);
    } else {
      locale.set('en');
    }
  })

  function toggleLanguage() {
    const newLocale = $locale === 'en' ? 'pt' : 'en';

    const pathParts = page.url.pathname.split('/');
    const pathWithoutLocale = pathParts.slice(2).join('/');

    goto(`/${newLocale}/${pathWithoutLocale}`);
  }
</script>

<button
  aria-label="Toggle language"
  class="language-toggle"
  onclick={toggleLanguage}
>
  <span>{$locale === 'en' ? 'PT' : 'EN'}</span>
</button>

<style>
  .language-toggle {
    background: none;
    border: 1px solid rgba(76, 175, 80, 0.5);
    border-radius: 4px;
    color: #4CAF50;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 14px;
    font-weight: 600;
    padding: 4px 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .language-toggle:hover {
    background-color: rgba(76, 175, 80, 0.1);
    border-color: #4CAF50;
  }
  
  @media (min-width: 640px) {
    .language-toggle {
      font-size: 16px;
      padding: 6px 10px;
    }
  }
</style>
