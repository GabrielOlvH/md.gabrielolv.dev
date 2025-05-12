import type { EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
  // Define the locales for which base pages should be generated (e.g., /en, /pt)
  return [
    { locale: 'en' },
    { locale: 'pt' }
  ];
};

// If you need a load function for the locale index pages (e.g., to load featured posts for /en/)
// add it here. Make sure it's compatible with prerendering (uses only params or build-time data).
// Example:
// import type { PageServerLoad } from './$types';
// export const load: PageServerLoad = async ({ params }) => {
//   // Load data specific to the locale index page
//   return { locale: params.locale };
// }; 