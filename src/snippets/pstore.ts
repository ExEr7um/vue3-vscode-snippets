import * as vscode from "vscode"

import type { ConfigurableSnippet, PiniaApi, PstoreConfig } from "../types"

/** Snippet transform turning the file name into a capitalized store name. */
const STORE_NAME = "${TM_FILENAME_BASE/(.*)/${1:/capitalize}/}"

/** Configurable `pstore` snippet: a base Pinia store. */
export const pstore: ConfigurableSnippet = {
  buildBody: () => buildPstoreBody(readPstoreConfig()),
  detail: "Base code needed for a Pinia store file",
  languages: ["javascript", "typescript"],
  prefix: "pstore",
  section: "vueSnippets.pstore",
}

/**
 * Builds the `acceptHMRUpdate` block of the `pstore` snippet.
 *
 * @returns The `import.meta.hot` block snippet text.
 */
function buildHmrBlock(): string {
  return [
    "if (import.meta.hot) {",
    `\timport.meta.hot.accept(acceptHMRUpdate(use${STORE_NAME}Store, import.meta.hot))`,
    "}",
  ].join("\n")
}

/**
 * Builds the full body of the `pstore` snippet.
 *
 * @param config Resolved `pstore` configuration.
 * @returns The snippet body for the configured API with or without HMR.
 */
function buildPstoreBody(config: PstoreConfig): string {
  const imports = config.hmr ? "defineStore, acceptHMRUpdate" : "defineStore"

  const blocks = [
    `import { ${imports} } from "pinia"`,
    buildStoreBlock(config),
    config.hmr ? buildHmrBlock() : undefined,
  ].filter((block) => block !== undefined)

  return blocks.join("\n\n")
}

/**
 * Builds the `defineStore` block of the `pstore` snippet.
 *
 * @param config Resolved `pstore` configuration.
 * @returns The `defineStore` block snippet text.
 */
function buildStoreBlock(config: PstoreConfig): string {
  const declaration = `export const use${STORE_NAME}Store = defineStore("$TM_FILENAME_BASE", `

  if (config.api === "composition") {
    return `${declaration}() => {\n\t\${0}\n})`
  }

  return [
    `${declaration}{`,
    "\tstate: () => ({",
    "\t\t${0}",
    "\t}),",
    "\tgetters: {},",
    "\tactions: {},",
    "})",
  ].join("\n")
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
    api: config.get<PiniaApi>("api", "composition"),
    hmr: config.get<boolean>("hmr", true),
  }
}
