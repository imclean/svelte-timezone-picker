import type { TimezoneData, TimezoneValue } from './types';

/**
 * Converts the original timezone format to the localized structure
 *
 * @param timezones The original timezone data
 * @returns A new TimezoneData structure with English as the default locale
 */
export function convertOriginalToLocalized(
	timezones: Record<string, Record<string, [string, string, string]>>
): TimezoneData {
	const result: TimezoneData = {};

	Object.keys(timezones).forEach((region) => {
		if (!result[region]) {
			result[region] = { en: {} };
		}

		Object.entries(timezones[region]).forEach(([timezone, [city, standardTime, daylightTime]]) => {
			result[region].en[timezone] = [city, standardTime, daylightTime];
		});
	});

	return result;
}
/**
 * Gets TimezoneValue data filtered for a specific language and city value.
 * If the language is not available, falls back to English (en).
 *
 * @param locale - The locale code (e.g., 'en', 'it', 'de', 'ja', 'zh')
 * @param city - The city name to filter by
 * @param fallbackLocale - Fallback locale if requested locale isn't available (defaults to 'en')
 * @returns TimezoneValue filtered for the requested locale and city
 */
export function getTimezoneValueForCity(
	locale: string,
	city: string,
	fallbackLocale: string = 'en',
	timezoneData: TimezoneData
): TimezoneValue | null {
	const anyRegion = Object.keys(timezoneData)[0];
	const availableLocales = Object.keys(timezoneData[anyRegion]);

	// Check if requested locale is available; otherwise, use fallback
	const targetLocale = availableLocales.includes(locale) ? locale : fallbackLocale;

	for (const region of Object.keys(timezoneData)) {
		if (timezoneData[region][targetLocale] && timezoneData[region][targetLocale][city]) {
			return timezoneData[region][targetLocale][city];
		}
	}

	return null;
}
/**
 * Gets timezone data filtered for a specific language.
 * If the language is not available, falls back to English (en).
 *
 * @param locale - The locale code (e.g., 'en', 'it', 'de', 'ja', 'zh')
 * @param fallbackLocale - Fallback locale if requested locale isn't available (defaults to 'en')
 * @returns TimezoneData filtered for the requested locale
 */
export function getTimezoneDataForLocale(
	locale: string,
	fallbackLocale: string = 'en',
	timezoneData: TimezoneData
): TimezoneData {
	// Make a deep copy of the structure to avoid modifying the original
	const filteredData: TimezoneData = {};

	// Get the list of available locales from any region
	const anyRegion = Object.keys(timezoneData)[0];
	const availableLocales = Object.keys(timezoneData[anyRegion]);

	// Check if requested locale is available; otherwise, use fallback
	const targetLocale = availableLocales.includes(locale) ? locale : fallbackLocale;

	// For each region, include only the requested locale data
	for (const region of Object.keys(timezoneData)) {
		filteredData[region] = {
			[targetLocale]: timezoneData[region][targetLocale] || timezoneData[region][fallbackLocale]
		};
	}

	return filteredData;
}

/**
 * Gets a list of all available languages in the timezone data
 *
 * @returns Array of available locale codes
 */
export function getAvailableLocales(timezoneData: TimezoneData): string[] {
	// Extract available locales from the first region
	const anyRegion = Object.keys(timezoneData)[0];
	return Object.keys(timezoneData[anyRegion]);
}

/**
 * Gets timezone data for multiple languages.
 * Useful if you want to support language switching without reloading data.
 *
 * @param locales - Array of locale codes to include
 * @returns TimezoneData containing only the requested locales
 */
export function getTimezoneDataForLocales(
	locales: string[],
	timezoneData: TimezoneData
): TimezoneData {
	const filteredData: TimezoneData = {};

	for (const region of Object.keys(timezoneData)) {
		filteredData[region] = {};

		for (const locale of locales) {
			if (timezoneData[region][locale]) {
				filteredData[region][locale] = timezoneData[region][locale];
			}
		}

		// Ensure at least one locale is available (fallback to 'en')
		if (Object.keys(filteredData[region]).length === 0 && timezoneData[region]['en']) {
			filteredData[region]['en'] = timezoneData[region]['en'];
		}
	}

	return filteredData;
}
