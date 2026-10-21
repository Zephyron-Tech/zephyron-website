import { defineRouting } from 'next-intl/routing';

// Czech only for now. When adding English, add 'en' here, create
// src/messages/en.json and switch folder slugs to next-intl `pathnames`.
export const routing = defineRouting({
  locales: ['cs'],
  defaultLocale: 'cs',
  localePrefix: 'as-needed',
  localeDetection: false,
});
