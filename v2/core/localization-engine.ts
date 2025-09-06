import fs from "fs";
import path from "path";

const reconciliationsFile = path.resolve("docs/meta/reconciliations.md");
const translationsFile = path.resolve("docs/meta/translations.log");

interface TranslationEntry {
  lang: string;
  key: string;
  value: string;
}

// ✅ declare as const since the array reference never changes
const translations: TranslationEntry[] = [];

export function addTranslation(entry: TranslationEntry) {
  translations.push(entry);
  fs.appendFileSync(translationsFile, `\n${entry.lang} :: ${entry.key} = ${entry.value}`);
}

export function translate(key: string, lang: string): string {
  const match = translations.find((t) => t.key === key && t.lang === lang);
  if (match) return match.value;

  // ✅ auto-generate placeholder if missing
  const placeholder = `[${lang.toUpperCase()} translation pending: ${key}]`;
  addTranslation({ lang, key, value: placeholder });

  const treaty =
    `\n## Treaty: ${new Date().toISOString()}\n` +
    `- Issue: Missing translation for '${key}' in '${lang}'\n` +
    `- Resolution: Auto-generated placeholder '${placeholder}'`;
  fs.appendFileSync(reconciliationsFile, treaty);

  return placeholder;
}

// CLI / CI runner
if (require.main === module) {
  console.log("Testing autonomous localization...");
  console.log("EN:", translate("welcome", "en"));
  console.log("ES:", translate("welcome", "es"));
  console.log("JP:", translate("welcome", "jp"));
}
