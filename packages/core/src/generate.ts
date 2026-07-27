import type { SnippetEntry, SnippetVariant } from "./types"

import { buildPstoreBody, PSTORE_DEFAULTS, PSTORE_VARIANTS } from "./pstore"
import { buildVbaseBody, VBASE_DEFAULTS, VBASE_VARIANTS } from "./vbase"

/**
 * Builds the snippet file contents for every `pstore` variant.
 *
 * @returns Snippet entries keyed by their name.
 */
export function buildPstoreSnippets(): Record<string, SnippetEntry> {
  return buildVariantSnippets(
    "pstore",
    PSTORE_DEFAULTS,
    PSTORE_VARIANTS,
    buildPstoreBody,
  )
}

/**
 * Builds the snippet file contents for every `vbase` variant.
 *
 * @returns Snippet entries keyed by their name.
 */
export function buildVbaseSnippets(): Record<string, SnippetEntry> {
  return buildVariantSnippets(
    "vbase",
    VBASE_DEFAULTS,
    VBASE_VARIANTS,
    buildVbaseBody,
  )
}

/**
 * Turns snippet variants into snippet file entries.
 *
 * @template TConfig Configuration of the snippet the variants are based on.
 * @param prefix Prefix of the configurable snippet the variants are based on.
 * @param defaults Configuration the variant overrides are applied on top of.
 * @param variants Variants to build.
 * @param buildBody Builder producing a snippet body from a configuration.
 * @returns Snippet entries keyed by their name.
 */
function buildVariantSnippets<TConfig>(
  prefix: string,
  defaults: TConfig,
  variants: SnippetVariant<TConfig>[],
  buildBody: (config: TConfig) => string,
): Record<string, SnippetEntry> {
  return Object.fromEntries(
    variants.map((variant) => [
      variant.name,
      {
        body: buildBody({ ...defaults, ...variant.config }).split("\n"),
        description: variant.description,
        prefix: `${prefix}-${variant.suffix}`,
      },
    ]),
  )
}
