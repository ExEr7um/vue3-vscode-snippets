/** Every block a `vbase` snippet can contain, in the default order. */
export const BLOCKS = ["script", "template", "style"] as const

/** Every API style a Pinia store can be written in. */
export const PINIA_APIS = ["composition", "options"] as const

/** Every language the `<script>` block of a Vue SFC can be written in. */
export const SCRIPT_LANGS = ["js", "ts"] as const

/** Every language the `<style>` block of a Vue SFC can be written in. */
export const STYLE_LANGS = [
  "css",
  "less",
  "none",
  "postcss",
  "sass",
  "scss",
  "stylus",
] as const

export type Block = (typeof BLOCKS)[number]

export interface ConfigurableSnippet {
  /** Builds the snippet body from the settings the editor reports. */
  buildBody: (read: SettingsReader) => string
  /** Short human-readable description shown in the completion. */
  detail: string
  /** Languages the snippet is offered for. */
  languages: string[]
  /** Prefix that triggers the snippet. */
  prefix: string
  /** Settings section configuring the snippet, e.g. `vueSnippets.vbase`. */
  section: string
  /** Schema of the settings the section holds, with resolved defaults. */
  settings: ResolvedSetting[]
  /** Ready-made variants as snippet file entries, keyed by their name. */
  variants: Record<string, SnippetEntry>
}

export type PiniaApi = (typeof PINIA_APIS)[number]

export interface PstoreConfig {
  api: PiniaApi
  hmr: boolean
}

export interface ResolvedSetting {
  /** Value used when the setting is not set by the user. */
  default: unknown
  /** Values the setting accepts, for settings holding an enumeration. */
  enum?: readonly string[]
  /** Name of the setting inside its section. */
  key: string
  /** Description rendered in the editor settings UI. */
  markdownDescription: string
}

export type ScriptLang = (typeof SCRIPT_LANGS)[number]

export interface SettingSchema<TConfig> {
  /** Values the setting accepts, for settings holding an enumeration. */
  enum?: readonly string[]
  /** Name of the setting inside its section. */
  key: Extract<keyof TConfig, string>
  /** Description rendered in the editor settings UI. */
  markdownDescription: string
}

export type SettingsReader = (key: string, fallback: unknown) => unknown

export interface SnippetDefinition<TConfig extends object> {
  /** Builds the snippet body from a resolved configuration. */
  buildBody: (config: TConfig) => string
  /** Configuration used when nothing is set by the user. */
  defaults: TConfig
  /** Short human-readable description shown in the completion. */
  detail: string
  /** Languages the snippet is offered for. */
  languages: string[]
  /** Sanitizes a configuration read from the editor settings. */
  normalize?: (config: TConfig) => TConfig
  /** Prefix that triggers the snippet. */
  prefix: string
  /** Settings section configuring the snippet, e.g. `vueSnippets.vbase`. */
  section: string
  /** Schema of the settings the section holds. */
  settings: SettingSchema<TConfig>[]
  /** Ready-made variants shipped alongside the configurable snippet. */
  variants: SnippetVariant<TConfig>[]
}

export interface SnippetEntry {
  /** Snippet body, one array item per line. */
  body: string[]
  /** Description shown by the editor next to the completion. */
  description: string
  /** Prefix that triggers the snippet. */
  prefix: string
}

export interface SnippetVariant<TConfig> {
  /** Configuration overrides applied on top of the snippet defaults. */
  config: Partial<TConfig>
  /** Description shown by the editor next to the completion. */
  description: string
  /** Name of the snippet, used as its key in the snippet file. */
  name: string
  /** Suffix appended to the base prefix, e.g. `sass` for `vbase-sass`. */
  suffix: string
}

export type StyleLang = (typeof STYLE_LANGS)[number]

export interface VbaseConfig {
  blockOrder: Block[]
  scriptLang: ScriptLang
  scriptSetup: boolean
  scriptVapor: boolean
  styleLang: StyleLang
  styleScoped: boolean
  templateRootTag: string
}
