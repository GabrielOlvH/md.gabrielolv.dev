import { redirect } from '@sveltejs/kit';
import { defaultLocale } from '$lib/i18n';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
  // Get preferred language from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  // Check if the user prefers Portuguese
  const prefersPt = acceptLanguage.includes('pt');
  
  // Redirect to the appropriate language version
  throw redirect(307, prefersPt ? '/pt' : `/${defaultLocale}`);
};
