export type Block = "script" | "style" | "template"

export interface ConfigurableSnippet {
  /** Builds the snippet body from the current configuration. */
  buildBody: () => string
  /** Short human-readable description shown in the completion. */
  detail: string
  /** Languages the completion is offered for. */
  languages: string[]
  /** Completion prefix and label. */
  prefix: string
  /** Settings section that configures the snippet, e.g. `vueSnippets.vbase`. */
  section: string
}

export type PiniaApi = "composition" | "options"

export interface PstoreConfig {
  api: PiniaApi
  hmr: boolean
}

export type ScriptLang = "js" | "ts"

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
