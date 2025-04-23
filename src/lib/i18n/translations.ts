import { browser } from '$app/environment';
import { derived, writable } from 'svelte/store';
import { page } from '$app/stores';
import { defaultLocale, getLocaleFromPath } from '.';

// Import translations
import en from './translations/en.json';
import pt from './translations/pt.json';

// Define translations dictionary
const translations = {
  en,
  pt
};

// Create a writable store for the locale
export const locale = writable(defaultLocale);

// Update locale based on URL path
if (browser) {
  page.subscribe(($page) => {
    const pathLocale = getLocaleFromPath($page.url?.pathname || 'en');
    locale.set(pathLocale);
  });
}

// Create a derived store for translations
export const t = derived(locale, ($locale) => {
  // Return a function that gets nested translation keys
  return (key: string, vars = {}) => {
    // Split the key into parts (e.g., "common.button.submit" -> ["common", "button", "submit"])
    const keys = key.split('.');
    
    // Get the translation object for the current locale
    const translationObj = translations[$locale] || translations[defaultLocale];
    
    // Navigate through the translation object to find the requested key
    let translation = translationObj;
    for (const k of keys) {
      translation = translation[k];
      if (!translation) break;
    }
    
    // If translation is not found, return the key
    if (!translation) return key;
    
    // Replace variables in the translation string
    return Object.entries(vars).reduce((acc, [k, v]) => {
      return acc.replace(new RegExp(`{${k}}`, 'g'), v);
    }, translation);
  };
});

// Function to format date based on locale
export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
