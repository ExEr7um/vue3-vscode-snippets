import type * as vscode from "vscode"

import type { ConfigurableSnippet } from "./types"

import { registerConfigurableSnippet } from "./register"
import { vbase } from "./snippets/vbase"

const SNIPPETS: ConfigurableSnippet[] = [vbase]

/**
 * Registers every configurable snippet completion.
 *
 * @param context Extension context provided by VS Code.
 */
export function activate(context: vscode.ExtensionContext): void {
  for (const snippet of SNIPPETS) {
    registerConfigurableSnippet(context, snippet)
  }
}

/** Deactivates the extension. Nothing to clean up. */
export function deactivate(): void {}
