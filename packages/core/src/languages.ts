/**
 * Languages every snippet file is registered for, keyed by its path inside the
 * `snippets` directory without the `.json` extension.
 *
 * This is the single source of the extension manifest `contributes.snippets`
 * entries, so a file listed here needs no further wiring.
 */
export const SNIPPET_LANGUAGES: Record<string, string[]> = {
  "generated/pstore": ["javascript", "typescript"],
  "generated/vbase": ["vue"],
  "histoire/histoire": ["vue"],
  "histoire/histoire-script": ["javascript", "typescript"],
  "histoire/histoire-template": ["html"],
  "nuxt/nuxt-script": ["javascript", "typescript"],
  "nuxt/nuxt-template": ["html"],
  "vitest/nuxt": ["javascript", "typescript"],
  "vitest/vitest": ["javascript", "typescript"],
  "vitest/vue": ["javascript", "typescript"],
  "vue/vue-css": ["css", "less", "scss"],
  "vue/vue-router": ["javascript", "typescript"],
  "vue/vue-script": ["javascript", "typescript"],
  "vue/vue-template": ["html"],
}

/** Snippet files written by the generator rather than authored by hand. */
export const GENERATED_SNIPPETS = ["generated/pstore", "generated/vbase"]
