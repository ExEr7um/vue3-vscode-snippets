import type { Block, SnippetVariant, VbaseConfig } from "./types"

import { defineSnippet } from "./define"
import { BLOCKS, SCRIPT_LANGS, STYLE_LANGS } from "./types"

/** Default `vbase` configuration, mirrored by the extension settings. */
export const VBASE_DEFAULTS: VbaseConfig = {
  blockOrder: [...BLOCKS],
  scriptLang: "ts",
  scriptSetup: true,
  scriptVapor: false,
  styleLang: "scss",
  styleScoped: true,
  templateRootTag: "div",
}

/**
 * Ready-made `vbase` variants shipped alongside the configurable snippet.
 *
 * Every variant differs from {@link VBASE_DEFAULTS} along a single axis, so
 * the completion list stays readable. The suffixes are part of the public API
 * and must not be derived from the configuration.
 */
const VARIANTS: SnippetVariant<VbaseConfig>[] = [
  {
    config: { styleLang: "sass" },
    description: "Base for Vue 3 File with <script setup>, TypeScript and SASS",
    name: "Vue SFC <script setup>, TS, SASS",
    suffix: "sass",
  },
  {
    config: { styleLang: "less" },
    description: "Base for Vue 3 File with <script setup>, TypeScript and LESS",
    name: "Vue SFC <script setup>, TS, LESS",
    suffix: "less",
  },
  {
    config: { styleLang: "postcss" },
    description:
      "Base for Vue 3 File with <script setup>, TypeScript and PostCSS",
    name: "Vue SFC <script setup>, TS, PostCSS",
    suffix: "pcss",
  },
  {
    config: { styleLang: "css" },
    description: "Base for Vue 3 File with <script setup>, TypeScript and CSS",
    name: "Vue SFC <script setup>, TS, CSS",
    suffix: "css",
  },
  {
    config: { styleLang: "stylus" },
    description:
      "Base for Vue 3 File with <script setup>, TypeScript and Stylus",
    name: "Vue SFC <script setup>, TS, Stylus",
    suffix: "styl",
  },
  {
    config: { styleLang: "none" },
    description:
      "Base for Vue 3 File with <script setup>, TypeScript and no style",
    name: "Vue SFC <script setup>, TS, No Style",
    suffix: "ns",
  },
  {
    config: { scriptVapor: true },
    description: "Base for Vue 3 File with <script vapor>, TypeScript and SCSS",
    name: "Vue SFC <script vapor>, TS, SCSS",
    suffix: "vapor",
  },
  {
    config: { scriptLang: "js" },
    description: "Base for Vue 3 File with <script setup>, JavaScript and SCSS",
    name: "Vue SFC <script setup>, JS, SCSS",
    suffix: "js",
  },
]

/** Configurable `vbase` snippet: a base Vue 3 SFC. */
export const VBASE = defineSnippet<VbaseConfig>({
  buildBody: buildVbaseBody,
  defaults: VBASE_DEFAULTS,
  detail: "Base for Vue 3 File",
  languages: ["vue"],
  normalize: (config) => ({
    ...config,
    blockOrder: normalizeBlockOrder(config.blockOrder),
  }),
  prefix: "vbase",
  section: "vueSnippets.vbase",
  settings: [
    {
      enum: SCRIPT_LANGS,
      key: "scriptLang",
      markdownDescription:
        "Language of the `<script>` block in the `vbase` snippet. `js` omits the `lang` attribute.",
    },
    {
      key: "scriptSetup",
      markdownDescription: "Use `<script setup>` in the `vbase` snippet.",
    },
    {
      key: "scriptVapor",
      markdownDescription:
        "Use `<script vapor>` in the `vbase` snippet. Vapor mode implies `setup`, so this shorthand is used regardless of `#vueSnippets.vbase.scriptSetup#`.",
    },
    {
      enum: STYLE_LANGS,
      key: "styleLang",
      markdownDescription:
        "Language of the `<style>` block in the `vbase` snippet. `none` omits the `<style>` block entirely.",
    },
    {
      key: "styleScoped",
      markdownDescription:
        "Add the `scoped` attribute to the `<style>` block in the `vbase` snippet.",
    },
    {
      key: "templateRootTag",
      markdownDescription:
        "Root tag wrapping the cursor inside the `<template>` block in the `vbase` snippet. Empty string omits the wrapper.",
    },
    {
      enum: BLOCKS,
      key: "blockOrder",
      markdownDescription:
        "Order of the blocks in the `vbase` snippet. Blocks not listed here are omitted.",
    },
  ],
  variants: VARIANTS,
})

/**
 * Builds the full body of the `vbase` snippet.
 *
 * @param config Resolved `vbase` configuration.
 * @returns The snippet body with the configured blocks in the configured order.
 */
export function buildVbaseBody(config: VbaseConfig): string {
  const blocks = config.blockOrder
    .map((block) => {
      if (block === "script") return buildScriptBlock(config)
      if (block === "template") return buildTemplateBlock(config)

      return config.styleLang === "none" ? undefined : buildStyleBlock(config)
    })
    .filter((block) => block !== undefined)

  return blocks.join("\n\n")
}

/**
 * Drops unknown and duplicated entries from a configured block order.
 *
 * @param order Block order to normalize, possibly holding arbitrary values.
 * @returns The known blocks, each kept at its first position.
 */
export function normalizeBlockOrder(order: readonly string[]): Block[] {
  return order.filter(
    (block, index): block is Block =>
      BLOCKS.includes(block as Block) && order.indexOf(block) === index,
  )
}

/**
 * Builds the `<script>` block of the `vbase` snippet.
 *
 * Vapor mode implies `setup`, so `<script vapor>` is always emitted as the
 * shorthand for `<script setup vapor>`.
 *
 * @param config Resolved `vbase` configuration.
 * @returns The `<script>` block snippet text.
 */
function buildScriptBlock(config: VbaseConfig): string {
  const lang = config.scriptLang === "ts" ? ' lang="ts"' : ""

  let mode = ""

  if (config.scriptVapor) mode = " vapor"
  else if (config.scriptSetup) mode = " setup"

  return `<script${mode}${lang}>\n\n</script>`
}

/**
 * Builds the `<style>` block of the `vbase` snippet.
 *
 * @param config Resolved `vbase` configuration.
 * @returns The `<style>` block snippet text.
 */
function buildStyleBlock(config: VbaseConfig): string {
  const scoped = config.styleScoped ? " scoped" : ""

  return `<style lang="${config.styleLang}"${scoped}>\n\n</style>`
}

/**
 * Builds the `<template>` block of the `vbase` snippet.
 *
 * @param config Resolved `vbase` configuration.
 * @returns The `<template>` block snippet text.
 */
function buildTemplateBlock(config: VbaseConfig): string {
  const tag = escapeSnippetText(config.templateRootTag.trim())

  if (!tag) return "<template>\n\t${0}\n</template>"

  return `<template>\n\t<${tag}>\n\t\t\${0}\n\t</${tag}>\n</template>`
}

/**
 * Escapes characters that have a special meaning in VS Code snippet syntax.
 *
 * @param text Raw text to insert into the snippet.
 * @returns Text safe to embed in a snippet body.
 */
function escapeSnippetText(text: string): string {
  return text.replaceAll(/[$\\}]/g, String.raw`\$&`)
}
