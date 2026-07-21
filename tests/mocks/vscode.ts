import { vi } from "vitest"

const state = { settings: new Map<string, unknown>() }

/** Mock of the `vscode.MarkdownString` class. */
export class MarkdownString {
  value: string

  constructor(value: string) {
    this.value = value
  }
}

/** Mock of the `vscode.SnippetString` class. */
export class SnippetString {
  value: string

  constructor(value: string) {
    this.value = value
  }
}

/** Mock of the `vscode.CompletionItem` class. */
export class CompletionItem {
  detail?: string
  documentation?: MarkdownString
  insertText?: SnippetString
  kind: number
  label: string

  constructor(label: string, kind: number) {
    this.label = label
    this.kind = kind
  }
}

/**
 * Replaces the settings returned by the mocked `workspace.getConfiguration`.
 *
 * @param values Settings keys with their values, relative to the `vueSnippets` section.
 */
export function setSettings(values: Record<string, unknown>): void {
  state.settings = new Map(Object.entries(values))
}

export const CompletionItemKind = { Snippet: 14 }

export const workspace = {
  getConfiguration: vi.fn(() => ({
    get: <T>(key: string, fallback: T): T =>
      state.settings.has(key) ? (state.settings.get(key) as T) : fallback,
  })),
}

export const languages = { registerCompletionItemProvider: vi.fn() }
