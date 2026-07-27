export type Block = "script" | "style" | "template"

export type PiniaApi = "composition" | "options"

export interface PstoreConfig {
  api: PiniaApi
  hmr: boolean
}

export type ScriptLang = "js" | "ts"

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

export type StyleLang =
  | "css"
  | "less"
  | "none"
  | "postcss"
  | "sass"
  | "scss"
  | "stylus"

export interface VbaseConfig {
  blockOrder: Block[]
  scriptLang: ScriptLang
  scriptSetup: boolean
  scriptVapor: boolean
  styleLang: StyleLang
  styleScoped: boolean
  templateRootTag: string
}
