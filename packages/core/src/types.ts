export type Block = "script" | "style" | "template"

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
