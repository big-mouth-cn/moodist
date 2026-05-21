import { useCallback } from 'react';

import { useSettingsStore } from '@/stores/settings';
import { translations } from '@/i18n/translations';

type Replacements = Record<string, string | number>;

function getNestedValue(object: unknown, path: string) {
  return path.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') return undefined;

    return (current as Record<string, unknown>)[key];
  }, object);
}

function replaceTokens(value: string, replacements?: Replacements) {
  if (!replacements) return value;

  return Object.keys(replacements).reduce(
    (text, key) => text.replaceAll(`{${key}}`, String(replacements[key])),
    value,
  );
}

export function useI18n() {
  const language = useSettingsStore(state => state.language);

  const t = useCallback(
    (key: string, replacements?: Replacements) => {
      const value =
        getNestedValue(translations[language], key) ??
        getNestedValue(translations.en, key);

      if (typeof value !== 'string') return key;

      return replaceTokens(value, replacements);
    },
    [language],
  );

  return { language, t };
}
