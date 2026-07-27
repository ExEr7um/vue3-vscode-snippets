import { describe, expect, test } from "vitest"

import { PSTORE, STORE_NAME } from "../src/pstore"
import { VBASE } from "../src/vbase"

const { variants: vbase } = VBASE
const { variants: pstore } = PSTORE

/**
 * Collects the prefixes of every entry of a generated snippet file.
 *
 * @param snippets Generated snippet file contents.
 * @returns The prefixes, in file order.
 */
function prefixes(snippets: Record<string, { prefix: string }>): string[] {
  return Object.values(snippets).map((snippet) => snippet.prefix)
}

describe("vbase variants", () => {
  test("builds a snippet for every variant", () => {
    expect(prefixes(vbase)).toStrictEqual([
      "vbase-sass",
      "vbase-less",
      "vbase-pcss",
      "vbase-css",
      "vbase-styl",
      "vbase-ns",
      "vbase-vapor",
      "vbase-js",
    ])
  })

  test("applies the variant overrides on top of the defaults", () => {
    expect(vbase["Vue SFC <script setup>, TS, SASS"]).toStrictEqual({
      body: [
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
        '<style lang="sass" scoped>',
        "",
        "</style>",
      ],
      description:
        "Base for Vue 3 File with <script setup>, TypeScript and SASS",
      prefix: "vbase-sass",
    })
  })

  test("omits the style block in the no style variant", () => {
    expect(vbase["Vue SFC <script setup>, TS, No Style"]?.body).toStrictEqual([
      '<script setup lang="ts">',
      "",
      "</script>",
      "",
      "<template>",
      "\t<div>",
      "\t\t${0}",
      "\t</div>",
      "</template>",
    ])
  })

  test("uses the vapor shorthand in the vapor variant", () => {
    expect(vbase["Vue SFC <script vapor>, TS, SCSS"]?.body[0]).toBe(
      '<script vapor lang="ts">',
    )
  })

  test("omits the lang attribute in the js variant", () => {
    expect(vbase["Vue SFC <script setup>, JS, SCSS"]?.body[0]).toBe(
      "<script setup>",
    )
  })
})

describe("pstore variants", () => {
  test("builds a snippet for every variant", () => {
    expect(prefixes(pstore)).toStrictEqual([
      "pstore-options",
      "pstore-nohmr",
      "pstore-options-nohmr",
    ])
  })

  test("applies the variant overrides on top of the defaults", () => {
    expect(pstore["Pinia Store Base - Options API"]).toStrictEqual({
      body: [
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
      ],
      description: "Base code needed for a Pinia store file with Options API",
      prefix: "pstore-options",
    })
  })

  test("omits the HMR block in the no HMR variants", () => {
    for (const name of [
      "Pinia Store Base - No HMR",
      "Pinia Store Base - Options API, No HMR",
    ]) {
      expect(pstore[name]?.body.join("\n")).not.toContain("acceptHMRUpdate")
    }
  })
})

describe("generated snippets", () => {
  test("every prefix is unique", () => {
    const generated = [...prefixes(vbase), ...prefixes(pstore)]

    expect(new Set(generated).size).toBe(generated.length)
  })
})
