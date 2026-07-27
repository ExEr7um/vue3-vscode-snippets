import type * as vscode from "vscode"

import { CONFIGURABLE_SNIPPETS } from "@vue3-snippets/core"

import { registerConfigurableSnippet } from "./register"

/**
 * Registers every configurable snippet completion.
 *
 * @param context Extension context provided by VS Code.
 */
export function activate(context: vscode.ExtensionContext): void {
  for (const snippet of CONFIGURABLE_SNIPPETS) {
    registerConfigurableSnippet(context, snippet)
  }
}

/** Deactivates the extension. Nothing to clean up. */
export function deactivate(): void {}
