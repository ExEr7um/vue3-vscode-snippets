import { describe, expect, test } from "vitest"

import type { VbaseConfig } from "../src/types"

import {
  buildVbaseBody,
  normalizeBlockOrder,
  VBASE_DEFAULTS,
} from "../src/vbase"

/**
 * Builds a `vbase` body from the defaults with the given overrides applied.
 *
 * @param overrides Settings differing from the defaults.
 * @returns The snippet body.
 */
function build(overrides: Partial<VbaseConfig> = {}): string {
  return buildVbaseBody({ ...VBASE_DEFAULTS, ...overrides })
}

describe("buildVbaseBody", () => {
  test("produces a scoped SCSS Vue SFC by default", () => {
    expect(build()).toBe(
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
    expect(build({ scriptLang: "js" })).toContain("<script setup>")
  })

  test("drops the setup attribute when scriptSetup is disabled", () => {
    expect(build({ scriptSetup: false })).toContain('<script lang="ts">')
  })

  test.each([true, false])(
    "uses the vapor shorthand when scriptVapor is enabled and scriptSetup is %s",
    (scriptSetup) => {
      expect(build({ scriptSetup, scriptVapor: true })).toContain(
        '<script vapor lang="ts">',
      )
    },
  )

  test.each(["sass", "less", "postcss", "css", "stylus"] as const)(
    "uses %s as the style language",
    (styleLang) => {
      expect(build({ styleLang })).toContain(
        `<style lang="${styleLang}" scoped>`,
      )
    },
  )

  test("omits the style block when styleLang is none", () => {
    expect(build({ styleLang: "none" })).not.toContain("<style")
  })

  test("omits the scoped attribute when styleScoped is disabled", () => {
    expect(build({ styleScoped: false })).toContain('<style lang="scss">')
  })

  test("wraps the cursor in the configured template root tag", () => {
    expect(build({ templateRootTag: "section" })).toContain(
      "<template>\n\t<section>\n\t\t${0}\n\t</section>\n</template>",
    )
  })

  test("places the cursor directly inside the template when the root tag is empty", () => {
    expect(build({ templateRootTag: "" })).toContain(
      "<template>\n\t${0}\n</template>",
    )
  })

  test("escapes snippet syntax in the template root tag", () => {
    expect(build({ templateRootTag: "div$1" })).toContain(String.raw`<div\$1>`)
  })

  test("respects the configured block order", () => {
    expect(build({ blockOrder: ["template", "script", "style"] })).toBe(
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
    expect(build({ blockOrder: ["script"] })).toBe(
      '<script setup lang="ts">\n\n</script>',
    )
  })

  test("combines all settings", () => {
    expect(
      build({
        blockOrder: ["template", "script", "style"],
        scriptLang: "js",
        scriptSetup: true,
        scriptVapor: true,
        styleLang: "css",
        styleScoped: false,
        templateRootTag: "",
      }),
    ).toBe(
      [
        "<template>",
        "\t${0}",
        "</template>",
        "",
        "<script vapor>",
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

describe("normalizeBlockOrder", () => {
  test("keeps a valid order untouched", () => {
    expect(normalizeBlockOrder(["template", "script", "style"])).toStrictEqual([
      "template",
      "script",
      "style",
    ])
  })

  test("drops unknown and duplicated entries", () => {
    expect(
      normalizeBlockOrder(["style", "style", "nonsense", "script"]),
    ).toStrictEqual(["style", "script"])
  })
})
