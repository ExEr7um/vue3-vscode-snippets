import * as vscode from "vscode"

import type { ConfigurableSnippet } from "./types"

/**
 * Registers a completion that inserts a configuration-driven snippet for every
 * language the snippet targets.
 *
 * @param context Extension context provided by VS Code.
 * @param snippet Snippet definition to register.
 */
export function registerConfigurableSnippet(
  context: vscode.ExtensionContext,
  snippet: ConfigurableSnippet,
): void {
  for (const language of snippet.languages) {
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(language, {
        provideCompletionItems() {
          const body = snippet.buildBody()

          const item = new vscode.CompletionItem(
            snippet.prefix,
            vscode.CompletionItemKind.Snippet,
          )

          item.insertText = new vscode.SnippetString(body)
          item.detail = snippet.detail
          item.documentation = new vscode.MarkdownString(
            `${snippet.detail}. Can be configured with \`${snippet.section}\` settings.\n\`\`\`${snippet.languages[0]}\n${body}\n\`\`\``,
          )

          return [item]
        },
      }),
    )
  }
}
