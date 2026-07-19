import * as vscode from "vscode"

import type {
  Block,
  ConfigurableSnippet,
  ScriptLang,
  StyleLang,
  VbaseConfig,
} from "../types"

const BLOCKS: Block[] = ["script", "template", "style"]

/** Configurable `vbase` snippet: a base Vue 3 SFC. */
export const vbase: ConfigurableSnippet = {
  buildBody: () => buildVbaseBody(readVbaseConfig()),
  detail: "Base for Vue 3 File",
  languages: ["vue"],
  prefix: "vbase",
  section: "vueSnippets.vbase",
}

/**
 * Builds the `<script>` block of the `vbase` snippet.
 *
 * @param config Resolved `vbase` configuration.
 * @returns The `<script>` block snippet text.
 */
function buildScriptBlock(config: VbaseConfig): string {
  const setup = config.scriptSetup ? " setup" : ""
  const lang = config.scriptLang === "ts" ? ' lang="ts"' : ""

  return `<script${setup}${lang}>\n\n</script>`
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
 * Builds the full body of the `vbase` snippet.
 *
 * @param config Resolved `vbase` configuration.
 * @returns The snippet body with the configured blocks in the configured order.
 */
function buildVbaseBody(config: VbaseConfig): string {
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
 * Escapes characters that have a special meaning in VS Code snippet syntax.
 *
 * @param text Raw text to insert into the snippet.
 * @returns Text safe to embed in a snippet body.
 */
function escapeSnippetText(text: string): string {
  return text.replaceAll(/[$\\}]/g, String.raw`\$&`)
}

/**
 * Reads the `vueSnippets.vbase` configuration, falling back to the defaults
 * for the `vbase` snippet.
 *
 * @returns Resolved `vbase` configuration.
 */
function readVbaseConfig(): VbaseConfig {
  const config = vscode.workspace.getConfiguration("vueSnippets.vbase")

  const blockOrder = config
    .get<Block[]>("blockOrder", BLOCKS)
    .filter(
      (block, index, order) =>
        BLOCKS.includes(block) && order.indexOf(block) === index,
    )

  return {
    blockOrder,
    scriptLang: config.get<ScriptLang>("scriptLang", "ts"),
    scriptSetup: config.get<boolean>("scriptSetup", true),
    styleLang: config.get<StyleLang>("styleLang", "scss"),
    styleScoped: config.get<boolean>("styleScoped", true),
    templateRootTag: config.get<string>("templateRootTag", "div"),
  }
}
