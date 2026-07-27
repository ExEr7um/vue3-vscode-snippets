import type { Block, VbaseConfig } from "./types"

/** Every block a `vbase` snippet can contain, in the default order. */
export const BLOCKS: Block[] = ["script", "template", "style"]

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
