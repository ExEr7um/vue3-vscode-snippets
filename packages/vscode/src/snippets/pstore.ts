import type { PstoreConfig } from "@vue3-snippets/core"

import { buildPstoreBody, PSTORE_DEFAULTS } from "@vue3-snippets/core"
import * as vscode from "vscode"

import type { ConfigurableSnippet } from "../types"

/** Configurable `pstore` snippet: a base Pinia store. */
export const pstore: ConfigurableSnippet = {
  buildBody: () => buildPstoreBody(readPstoreConfig()),
  detail: "Base code needed for a Pinia store file",
  languages: ["javascript", "typescript"],
  prefix: "pstore",
  section: "vueSnippets.pstore",
}

/**
 * Reads the `vueSnippets.pstore` configuration, falling back to the defaults
 * for the `pstore` snippet.
 *
 * @returns Resolved `pstore` configuration.
 */
function readPstoreConfig(): PstoreConfig {
  const config = vscode.workspace.getConfiguration("vueSnippets.pstore")

  return {
    api: config.get("api", PSTORE_DEFAULTS.api),
    hmr: config.get("hmr", PSTORE_DEFAULTS.hmr),
  }
}
