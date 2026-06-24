export const defaultLanguage = "en";

export const supportedLanguages = [
  "en",
  "es",
  "fr",
  "pt",
  "de"
];

export const salmosFiles = {
  "en": "salmos_en.txt",
  "es": "salmos_es.txt",
  "fr": "salmos_fr.txt",
  "pt": "salmos_pt.txt",
  "de": "salmos_de.txt"
};

export const translationFiles = Object.freeze(
  Object.fromEntries(supportedLanguages.map((language) => [language, `content/i18n/${language}.json`]))
);

const translationCache = new Map();

export async function loadTranslations(language = defaultLanguage) {
  const selectedLanguage = supportedLanguages.includes(language) ? language : defaultLanguage;
  if (translationCache.has(selectedLanguage)) {
    return translationCache.get(selectedLanguage);
  }

  const response = await fetch(translationFiles[selectedLanguage]);
  if (!response.ok) {
    throw new Error(`Could not load translations for ${selectedLanguage}: HTTP ${response.status}`);
  }

  const dictionary = await response.json();
  translationCache.set(selectedLanguage, dictionary);
  return dictionary;
}
