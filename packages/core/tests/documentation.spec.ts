import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, test } from "vitest"

import type { SnippetEntry } from "../src/types"

import { GENERATED_FILES } from "../src/generate"
import {
  buildConfigurationProperties,
  CONFIGURABLE_SNIPPETS,
} from "../src/settings"

/** Repository root, resolved from this file's location. */
const ROOT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
)

/**
 * Collects the settings documented in the README, with the default value each
 * row claims.
 *
 * @returns The defaults, keyed by the fully qualified setting name.
 */
async function readDocumentedDefaults(): Promise<Record<string, unknown>> {
  const readme = await readFile(path.join(ROOT, "README.md"), "utf8")

  const rows = readme.matchAll(
    /^\| `(vueSnippets\.[\w.]+)`\s*\| `(.+?)`\s*\|/gm,
  )

  return Object.fromEntries(
    Array.from(rows, ([, name, value]) => [
      name as string,
      JSON.parse(value as string) as unknown,
    ]),
  )
}

/**
 * Collects the snippet prefixes documented in the README tables.
 *
 * @returns The documented prefixes.
 */
async function readDocumentedPrefixes(): Promise<Set<string>> {
  const readme = await readFile(path.join(ROOT, "README.md"), "utf8")

  const rows = readme.matchAll(/^\| `([^`]+)`/gm)

  return new Set(
    Array.from(rows, ([, prefix]) => prefix as string).filter(
      (prefix) => !prefix.startsWith("vueSnippets."),
    ),
  )
}

/**
 * Collects the prefix of every snippet the extension ships: the hand-written
 * files, the generated variants and the configurable snippets themselves.
 *
 * @returns The prefixes, in no particular order.
 */
async function readPrefixes(): Promise<string[]> {
  const directory = path.join(ROOT, "snippets")

  const entries = await readdir(directory, {
    recursive: true,
    withFileTypes: true,
  })

  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map(async (entry) => {
        const file = await readFile(path.join(entry.parentPath, entry.name))

        return JSON.parse(file.toString()) as Record<string, SnippetEntry>
      }),
  )

  return [
    ...files,
    ...Object.values(GENERATED_FILES),
    ...CONFIGURABLE_SNIPPETS.map((snippet) => ({
      [snippet.prefix]: { prefix: snippet.prefix } as SnippetEntry,
    })),
  ].flatMap((snippets) =>
    Object.values(snippets).map((snippet) => snippet.prefix),
  )
}

describe("snippets", () => {
  test("have a unique prefix", async () => {
    const prefixes = await readPrefixes()
    const repeated = prefixes.filter(
      (prefix, index) => prefixes.indexOf(prefix) !== index,
    )

    expect(repeated).toStrictEqual([])
  })

  test("are all documented in the README", async () => {
    const documented = await readDocumentedPrefixes()
    const prefixes = await readPrefixes()

    expect(prefixes.filter((prefix) => !documented.has(prefix))).toStrictEqual(
      [],
    )
  })

  test("are the only ones the README documents", async () => {
    const documented = await readDocumentedPrefixes()
    const prefixes = new Set(await readPrefixes())

    expect(
      [...documented].filter((prefix) => !prefixes.has(prefix)),
    ).toStrictEqual([])
  })
})

describe("settings", () => {
  test("are all documented in the README with their default", async () => {
    const documented = await readDocumentedDefaults()

    const defaults = Object.fromEntries(
      Object.entries(buildConfigurationProperties()).map(([name, property]) => [
        name,
        property.default,
      ]),
    )

    expect(documented).toStrictEqual(defaults)
  })
})
