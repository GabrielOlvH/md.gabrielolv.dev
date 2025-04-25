import { derived, writable, type Readable } from 'svelte/store';
import { defaultLocale } from '.';

import en from './translations/en.json';
import pt from './translations/pt.json';


type TranslationValue = string | { [key: string]: TranslationValue };

type Translations = {
	[locale: string]: TranslationValue;
};

type TranslateFunction = (key: string, vars?: Record<string, string | number>) => string;


const translations: Translations = {
	en,
	pt
};


export const locale = writable<string>(defaultLocale);

export const t: Readable<TranslateFunction> = derived(locale, ($locale) => {

	const currentLocale = $locale in translations ? $locale : defaultLocale;
	const translationBundle = translations[currentLocale];

	return (key: string, vars: Record<string, string | number> = {}): string => {
		const keys = key.split('.');

		let value: TranslationValue | undefined = translationBundle;

		for (const k of keys) {
			if (value && typeof value === 'object' && k in value) {
				value = (value as { [key: string]: TranslationValue })[k];
			} else {
				value = undefined;
				break;
			}
		}

		if (typeof value !== 'string') {
			return key;
		}

		let result = value;
		for (const [varKey, varValue] of Object.entries(vars)) {
			const regex = new RegExp(`{${varKey}}`, 'g');
			result = result.replace(regex, String(varValue));
		}

		return result;
	};
});


export function formatDate(date: Date, locale: string): string {
	const intlLocale = locale === 'pt' ? 'pt-BR' : 'en-US';

	try {
		return new Intl.DateTimeFormat(intlLocale, {
			year: 'numeric',
			month: 'long', day: 'numeric'
		}).format(date);
	} catch (e) {
		console.error(`Error formatting date for locale "${locale}" (${intlLocale}):`, e);
		return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
	}
}
