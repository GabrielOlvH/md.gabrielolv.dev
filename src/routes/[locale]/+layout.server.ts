import { locales, defaultLocale } from '$lib/i18n';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
  const { locale } = params;
  
  // Validate locale
  if (!locales.includes(locale)) {
    throw error(404, 'Locale not found');
  }
  
  return {
    locale
  };
};
