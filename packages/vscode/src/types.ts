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
