import type { PstoreConfig, SnippetVariant } from "./types"

/** Snippet transform turning the file name into a capitalized store name. */
export const STORE_NAME = "${TM_FILENAME_BASE/(.*)/${1:/capitalize}/}"

/** Default `pstore` configuration, mirrored by the extension settings. */
export const PSTORE_DEFAULTS: PstoreConfig = { api: "composition", hmr: true }

/**
 * Ready-made `pstore` variants shipped alongside the configurable snippet.
 *
 * The suffixes are part of the public API and must not be derived from the
 * configuration.
 */
export const PSTORE_VARIANTS: SnippetVariant<PstoreConfig>[] = [
  {
    config: { api: "options" },
    description: "Base code needed for a Pinia store file with Options API",
    name: "Pinia Store Base - Options API",
    suffix: "options",
  },
  {
    config: { hmr: false },
    description: "Base code needed for a Pinia store file without HMR",
    name: "Pinia Store Base - No HMR",
    suffix: "nohmr",
  },
  {
    config: { api: "options", hmr: false },
    description:
      "Base code needed for a Pinia store file with Options API and without HMR",
    name: "Pinia Store Base - Options API, No HMR",
    suffix: "options-nohmr",
  },
]

/**
 * Builds the full body of the `pstore` snippet.
 *
 * @param config Resolved `pstore` configuration.
 * @returns The snippet body for the configured API with or without HMR.
 */
export function buildPstoreBody(config: PstoreConfig): string {
  const imports = config.hmr ? "defineStore, acceptHMRUpdate" : "defineStore"

  const blocks = [
    `import { ${imports} } from "pinia"`,
    buildStoreBlock(config),
    config.hmr ? buildHmrBlock() : undefined,
  ].filter((block) => block !== undefined)

  return blocks.join("\n\n")
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
