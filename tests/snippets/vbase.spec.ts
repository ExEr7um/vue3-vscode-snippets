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

  test("produces a scoped SCSS Vue SFC by default", () => {
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

  test("omits the lang attribute for js scripts", () => {
    setSettings({ scriptLang: "js" })

    expect(vbase.buildBody()).toContain("<script setup>")
  })

  test("drops the setup attribute when scriptSetup is disabled", () => {
    setSettings({ scriptSetup: false })

    expect(vbase.buildBody()).toContain('<script lang="ts">')
  })

  test.each(["sass", "less", "postcss", "css", "stylus"] as const)(
    "uses %s as the style language",
    (lang) => {
      setSettings({ styleLang: lang })

      expect(vbase.buildBody()).toContain(`<style lang="${lang}" scoped>`)
    },
  )

  test("omits the style block when styleLang is none", () => {
    setSettings({ styleLang: "none" })

    expect(vbase.buildBody()).not.toContain("<style")
  })

  test("omits the scoped attribute when styleScoped is disabled", () => {
    setSettings({ styleScoped: false })

    expect(vbase.buildBody()).toContain('<style lang="scss">')
  })

  test("wraps the cursor in the configured template root tag", () => {
    setSettings({ templateRootTag: "section" })

    expect(vbase.buildBody()).toContain(
      "<template>\n\t<section>\n\t\t${0}\n\t</section>\n</template>",
    )
  })

  test("places the cursor directly inside the template when the root tag is empty", () => {
    setSettings({ templateRootTag: "" })

    expect(vbase.buildBody()).toContain("<template>\n\t${0}\n</template>")
  })

  test("escapes snippet syntax in the template root tag", () => {
    setSettings({ templateRootTag: "div$1" })

    expect(vbase.buildBody()).toContain(String.raw`<div\$1>`)
  })

  test("respects the configured block order", () => {
    setSettings({ blockOrder: ["template", "script", "style"] })

    expect(vbase.buildBody()).toBe(
      [
        "<template>",
        "\t<div>",
        "\t\t${0}",
        "\t</div>",
        "</template>",
        "",
        '<script setup lang="ts">',
        "",
        "</script>",
        "",
        '<style lang="scss" scoped>',
        "",
        "</style>",
      ].join("\n"),
    )
  })

  test("omits blocks missing from blockOrder", () => {
    setSettings({ blockOrder: ["script"] })

    expect(vbase.buildBody()).toBe('<script setup lang="ts">\n\n</script>')
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

  test("combines all settings", () => {
    setSettings({
      blockOrder: ["template", "script", "style"],
      scriptLang: "js",
      scriptSetup: true,
      styleLang: "css",
      styleScoped: false,
      templateRootTag: "",
    })

    expect(vbase.buildBody()).toBe(
      [
        "<template>",
        "\t${0}",
        "</template>",
        "",
        "<script setup>",
        "",
        "</script>",
        "",
        '<style lang="css">',
        "",
        "</style>",
      ].join("\n"),
    )
  })
})
