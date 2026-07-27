import { describe, expect, test } from "vitest"

import { PSTORE, PSTORE_DEFAULTS } from "../src/pstore"
import {
  buildConfigurationProperties,
  collectSnippetLanguages,
  CONFIGURABLE_SNIPPETS,
} from "../src/settings"
import { VBASE, VBASE_DEFAULTS } from "../src/vbase"

const properties = buildConfigurationProperties()

describe("CONFIGURABLE_SNIPPETS", () => {
  test.each([
    ["pstore", PSTORE, PSTORE_DEFAULTS],
    ["vbase", VBASE, VBASE_DEFAULTS],
  ] as const)("%s describes every setting it reads", (_, snippet, defaults) => {
    const described = snippet.settings
      .map((setting) => setting.key)
      .toSorted((left, right) => left.localeCompare(right))

    expect(described).toStrictEqual(
      Object.keys(defaults).toSorted((left, right) =>
        left.localeCompare(right),
      ),
    )
  })

  test("resolves the default of every setting", () => {
    const defaults = CONFIGURABLE_SNIPPETS.flatMap((snippet) =>
      snippet.settings.map((setting) => setting.default),
    )

    expect(defaults).not.toContain(undefined)
  })
})

describe("buildConfigurationProperties", () => {
  test("names every setting after its section", () => {
    expect(Object.keys(properties)).toStrictEqual([
      "vueSnippets.pstore.api",
      "vueSnippets.pstore.hmr",
      "vueSnippets.vbase.scriptLang",
      "vueSnippets.vbase.scriptSetup",
      "vueSnippets.vbase.scriptVapor",
      "vueSnippets.vbase.styleLang",
      "vueSnippets.vbase.styleScoped",
      "vueSnippets.vbase.templateRootTag",
      "vueSnippets.vbase.blockOrder",
    ])
  })

  test("takes the defaults from the snippet definitions", () => {
    expect(properties["vueSnippets.vbase.styleLang"]?.default).toBe(
      VBASE_DEFAULTS.styleLang,
    )
    expect(properties["vueSnippets.pstore.hmr"]?.default).toBe(
      PSTORE_DEFAULTS.hmr,
    )
  })

  test("derives the JSON type from the default value", () => {
    expect(properties["vueSnippets.vbase.styleLang"]?.type).toBe("string")
    expect(properties["vueSnippets.vbase.styleScoped"]?.type).toBe("boolean")
    expect(properties["vueSnippets.vbase.blockOrder"]?.type).toBe("array")
  })

  test("describes list settings with their item schema", () => {
    expect(properties["vueSnippets.vbase.blockOrder"]).toMatchObject({
      items: { enum: ["script", "template", "style"], type: "string" },
      uniqueItems: true,
    })
  })

  test("keeps settings without an enumeration free-form", () => {
    expect(
      properties["vueSnippets.vbase.templateRootTag"]?.enum,
    ).toBeUndefined()
  })
})

describe("collectSnippetLanguages", () => {
  test("collects the languages of every snippet without repeats", () => {
    expect(collectSnippetLanguages()).toStrictEqual([
      "javascript",
      "typescript",
      "vue",
    ])
  })
})
