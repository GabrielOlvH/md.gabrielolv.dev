// Supported locales
export const locales = ['en', 'pt'];
export const defaultLocale = 'en';


// Function to get the locale from a path
export function getLocaleFromPath(path: string): string {
  const pathParts = path.split('/').filter(Boolean);
  const firstPart = pathParts[0];
  
  if (locales.includes(firstPart)) {
    return firstPart;
  }
  
  return defaultLocale;
}

// Function to get the original slug without language suffix
export function getOriginalSlug(slug: string): string {
  return slug.replace(/\.(en|pt)$/, '');
}

// Function to extract locale from a post filename
export function getLocaleFromFilename(filename: string): string | null {
  const match = filename.match(/\.([a-z]{2})\.md$/);
  return match ? match[1] : null;
}

// Function to get the translated post path
export function getTranslatedPostPath(locale: string, slug: string): string {
  // Remove any existing language suffix if present
  const baseSlug = slug.replace(/\.(en|pt)$/, '');
  
  // For the default locale, we don't add a suffix
  if (locale === defaultLocale) {
    return baseSlug;
  }
  
  // For other locales, add the locale as a suffix
  return `${baseSlug}.${locale}`;
}
