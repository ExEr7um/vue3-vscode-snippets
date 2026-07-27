import { beforeEach, describe, expect, test } from "vitest"

import { pstore } from "../../src/snippets/pstore"
import { setSettings } from "../mocks/vscode"

const STORE_NAME = "${TM_FILENAME_BASE/(.*)/${1:/capitalize}/}"

describe("pstore snippet", () => {
  beforeEach(() => {
    setSettings({})
  })

  test("targets the script languages with the pstore prefix", () => {
    expect(pstore.prefix).toBe("pstore")
    expect(pstore.languages).toStrictEqual(["javascript", "typescript"])
  })

  test("falls back to the defaults when nothing is configured", () => {
    expect(pstore.buildBody()).toBe(
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

  test("passes every configured setting to the builder", () => {
    setSettings({ api: "options", hmr: false })

    expect(pstore.buildBody()).toBe(
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
