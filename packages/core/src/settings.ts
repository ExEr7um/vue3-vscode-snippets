import type { ConfigurableSnippet, ResolvedSetting } from "./types"

import { PSTORE } from "./pstore"
import { VBASE } from "./vbase"

export interface ConfigurationProperty {
  /** Value used when the setting is not set by the user. */
  default: unknown
  /** Values the setting accepts, for settings holding an enumeration. */
  enum?: readonly string[]
  /** Schema of the items, for settings holding a list. */
  items?: { enum: readonly string[]; type: "string" }
  /** Description rendered in the editor settings UI. */
  markdownDescription: string
  /** JSON type of the setting. */
  type: "array" | "boolean" | "string"
  /** Whether a list setting rejects repeated items. */
  uniqueItems?: boolean
}

/** Every snippet built from the editor settings. */
export const CONFIGURABLE_SNIPPETS: ConfigurableSnippet[] = [PSTORE, VBASE]

/**
 * Builds the JSON schema of every setting the extensions contribute.
 *
 * Defaults and enumerations come from the snippet definitions, so the settings
 * UI can never drift from the values the snippet builders actually use.
 *
 * @returns The settings schema, keyed by the fully qualified setting name.
 */
export function buildConfigurationProperties(): Record<
  string,
  ConfigurationProperty
> {
  return Object.fromEntries(
    CONFIGURABLE_SNIPPETS.flatMap((snippet) =>
      snippet.settings.map((setting) => [
        `${snippet.section}.${setting.key}`,
        buildProperty(setting),
      ]),
    ),
  )
}

/**
 * Collects the languages the configurable snippets are offered for.
 *
 * @returns The sorted language identifiers.
 */
export function collectSnippetLanguages(): string[] {
  const languages = CONFIGURABLE_SNIPPETS.flatMap(
    (snippet) => snippet.languages,
  )

  return [...new Set(languages)].toSorted((left, right) =>
    left.localeCompare(right),
  )
}

/**
 * Builds the JSON schema of a single setting from its default value.
 *
 * @param setting Schema of the setting, with its default resolved.
 * @returns The JSON schema of the setting.
 */
function buildProperty(setting: ResolvedSetting): ConfigurationProperty {
  const { default: value, enum: values, markdownDescription } = setting

  if (Array.isArray(value)) {
    return {
      default: value,
      items: { enum: values ?? [], type: "string" },
      markdownDescription,
      type: "array",
      uniqueItems: true,
    }
  }

  return {
    default: value,
    ...(values && { enum: values }),
    markdownDescription,
    type: typeof value === "boolean" ? "boolean" : "string",
  }
}
