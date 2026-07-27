import type { Block, VbaseConfig } from "@vue3-snippets/core"

import {
  buildVbaseBody,
  normalizeBlockOrder,
  VBASE_DEFAULTS,
} from "@vue3-snippets/core"
import * as vscode from "vscode"

import type { ConfigurableSnippet } from "../types"

/** Configurable `vbase` snippet: a base Vue 3 SFC. */
export const vbase: ConfigurableSnippet = {
  buildBody: () => buildVbaseBody(readVbaseConfig()),
  detail: "Base for Vue 3 File",
  languages: ["vue"],
  prefix: "vbase",
  section: "vueSnippets.vbase",
}

/**
 * Reads the `vueSnippets.vbase` configuration, falling back to the defaults
 * for the `vbase` snippet.
 *
 * @returns Resolved `vbase` configuration.
 */
function readVbaseConfig(): VbaseConfig {
  const config = vscode.workspace.getConfiguration("vueSnippets.vbase")

  return {
    blockOrder: normalizeBlockOrder(
      config.get<Block[]>("blockOrder", VBASE_DEFAULTS.blockOrder),
    ),
    scriptLang: config.get("scriptLang", VBASE_DEFAULTS.scriptLang),
    scriptSetup: config.get("scriptSetup", VBASE_DEFAULTS.scriptSetup),
    scriptVapor: config.get("scriptVapor", VBASE_DEFAULTS.scriptVapor),
    styleLang: config.get("styleLang", VBASE_DEFAULTS.styleLang),
    styleScoped: config.get("styleScoped", VBASE_DEFAULTS.styleScoped),
    templateRootTag: config.get(
      "templateRootTag",
      VBASE_DEFAULTS.templateRootTag,
    ),
  }
}
