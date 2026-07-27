import { describe, expect, test } from "vitest"

import type { PstoreConfig } from "../src/types"

import { buildPstoreBody, PSTORE_DEFAULTS, STORE_NAME } from "../src/pstore"

/**
 * Builds a `pstore` body from the defaults with the given overrides applied.
 *
 * @param overrides Settings differing from the defaults.
 * @returns The snippet body.
 */
function build(overrides: Partial<PstoreConfig> = {}): string {
  return buildPstoreBody({ ...PSTORE_DEFAULTS, ...overrides })
}

describe("buildPstoreBody", () => {
  test("produces a Composition API store with HMR by default", () => {
    expect(build()).toBe(
      [
        'import { defineStore, acceptHMRUpdate } from "pinia"',
        "",
        `export const use${STORE_NAME}Store = defineStore("$TM_FILENAME_BASE", () => {`,
        "\t${0}",
        "})",
        "",
        "if (import.meta.hot) {",
        `\timport.meta.hot.accept(acceptHMRUpdate(use${STORE_NAME}Store, import.meta.hot))`,
        "}",
      ].join("\n"),
    )
  })

  test("produces an Options API store when the api is options", () => {
    expect(build({ api: "options" })).toBe(
      [
        'import { defineStore, acceptHMRUpdate } from "pinia"',
        "",
        `export const use${STORE_NAME}Store = defineStore("$TM_FILENAME_BASE", {`,
        "\tstate: () => ({",
        "\t\t${0}",
        "\t}),",
        "\tgetters: {},",
        "\tactions: {},",
        "})",
        "",
        "if (import.meta.hot) {",
        `\timport.meta.hot.accept(acceptHMRUpdate(use${STORE_NAME}Store, import.meta.hot))`,
        "}",
      ].join("\n"),
    )
  })

  test("omits the HMR block and its import when hmr is disabled", () => {
    expect(build({ hmr: false })).toBe(
      [
        'import { defineStore } from "pinia"',
        "",
        `export const use${STORE_NAME}Store = defineStore("$TM_FILENAME_BASE", () => {`,
        "\t${0}",
        "})",
      ].join("\n"),
    )
  })

  test("combines all settings", () => {
    expect(build({ api: "options", hmr: false })).toBe(
      [
        'import { defineStore } from "pinia"',
        "",
        `export const use${STORE_NAME}Store = defineStore("$TM_FILENAME_BASE", {`,
        "\tstate: () => ({",
        "\t\t${0}",
        "\t}),",
        "\tgetters: {},",
        "\tactions: {},",
        "})",
      ].join("\n"),
    )
  })
})
