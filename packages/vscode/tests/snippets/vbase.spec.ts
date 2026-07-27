import { beforeEach, describe, expect, test } from "vitest"

import { vbase } from "../../src/snippets/vbase"
import { setSettings } from "../mocks/vscode"

describe("vbase snippet", () => {
  beforeEach(() => {
    setSettings({})
  })

  test("targets the vue language with the vbase prefix", () => {
    expect(vbase.prefix).toBe("vbase")
    expect(vbase.languages).toStrictEqual(["vue"])
  })

  test("falls back to the defaults when nothing is configured", () => {
    expect(vbase.buildBody()).toBe(
      [
        '<script setup lang="ts">',
        "",
        "</script>",
        "",
        "<template>",
        "\t<div>",
        "\t\t${0}",
        "\t</div>",
        "</template>",
        "",
        '<style lang="scss" scoped>',
        "",
        "</style>",
      ].join("\n"),
    )
  })

  test("passes every configured setting to the builder", () => {
    setSettings({
      blockOrder: ["template", "script"],
      scriptLang: "js",
      scriptSetup: false,
      scriptVapor: true,
      styleLang: "css",
      styleScoped: false,
      templateRootTag: "section",
    })

    expect(vbase.buildBody()).toBe(
      [
        "<template>",
        "\t<section>",
        "\t\t${0}",
        "\t</section>",
        "</template>",
        "",
        "<script vapor>",
        "",
        "</script>",
      ].join("\n"),
    )
  })

  test("ignores unknown and duplicated blockOrder entries", () => {
    setSettings({ blockOrder: ["style", "style", "nonsense", "script"] })

    expect(vbase.buildBody()).toBe(
      [
        '<style lang="scss" scoped>',
        "",
        "</style>",
        "",
        '<script setup lang="ts">',
        "",
        "</script>",
      ].join("\n"),
    )
  })
})
