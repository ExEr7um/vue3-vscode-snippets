import type { ConfigurableSnippet, SnippetDefinition } from "./types"

/**
 * Erases the configuration type of a snippet definition.
 *
 * The configuration shape only matters while the snippet is being declared:
 * everything downstream — the settings schema, the ready-made variants and the
 * completion — works the same for every snippet. Erasing the type here lets
 * them all be handled by a single list instead of one branch per snippet.
 *
 * @template TConfig Configuration of the snippet.
 * @param definition Snippet declaration to erase.
 * @returns The snippet with its configuration resolved and its variants built.
 */
export function defineSnippet<TConfig extends object>(
  definition: SnippetDefinition<TConfig>,
): ConfigurableSnippet {
  const { buildBody, defaults, normalize } = definition

  const build = (config: TConfig): string =>
    buildBody(normalize ? normalize(config) : config)

  return {
    buildBody: (read) =>
      build(
        Object.fromEntries(
          Object.entries(defaults).map(([key, fallback]) => [
            key,
            read(key, fallback),
          ]),
        ) as TConfig,
      ),
    detail: definition.detail,
    languages: definition.languages,
    prefix: definition.prefix,
    section: definition.section,
    settings: definition.settings.map((setting) => ({
      ...setting,
      default: defaults[setting.key],
    })),
    variants: Object.fromEntries(
      definition.variants.map((variant) => [
        variant.name,
        {
          body: build({ ...defaults, ...variant.config }).split("\n"),
          description: variant.description,
          prefix: `${definition.prefix}-${variant.suffix}`,
        },
      ]),
    ),
  }
}
