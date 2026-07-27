import type { SnippetEntry } from "@vue3-snippets/core"

import {
  buildPstoreSnippets,
  buildVbaseSnippets,
  SNIPPET_LANGUAGES,
} from "@vue3-snippets/core"
import { cp, mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

interface Manifest {
  contributes: { snippets: { language: string; path: string }[] }
}

/** Repository root, resolved from this script's location. */
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")

/** Directory of the VS Code extension package. */
const TARGET = path.join(ROOT, "packages", "vscode")

/**
 * Entries copied from the repository root into the VS Code package.
 *
 * `vsce` only packages files living next to the extension manifest, so the
 * shared sources and the marketplace pages are mirrored into the package
 * instead of being duplicated in the repository.
 */
const SHARED_ENTRIES = [
  "CHANGELOG.md",
  "LICENSE",
  "README.md",
  "images",
  "snippets",
]

/** Snippet files built from the configurable snippet definitions. */
const GENERATED_FILES: Record<string, Record<string, SnippetEntry>> = {
  "generated/pstore": buildPstoreSnippets(),
  "generated/vbase": buildVbaseSnippets(),
}

/**
 * Mirrors the shared repository files into the VS Code package.
 *
 * @returns A promise resolved once every entry is copied.
 */
async function copySharedEntries(): Promise<void> {
  await Promise.all(
    SHARED_ENTRIES.map((entry) =>
      cp(path.join(ROOT, entry), path.join(TARGET, entry), {
        force: true,
        recursive: true,
      }),
    ),
  )
}

/**
 * Writes the snippet files built from the configurable snippet definitions.
 *
 * @returns A promise resolved once every file is written.
 */
async function writeGeneratedSnippets(): Promise<void> {
  await mkdir(path.join(TARGET, "snippets", "generated"), { recursive: true })

  await Promise.all(
    Object.entries(GENERATED_FILES).map(([name, snippets]) =>
      writeFile(
        path.join(TARGET, "snippets", `${name}.json`),
        `${JSON.stringify(snippets, undefined, 2)}\n`,
      ),
    ),
  )
}

/**
 * Rewrites the `contributes.snippets` entries of the extension manifest from
 * the language map, so every snippet file is wired up in a single place.
 *
 * @returns A promise resolved once the manifest is up to date.
 */
async function writeSnippetContributions(): Promise<void> {
  const manifestPath = path.join(TARGET, "package.json")
  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Manifest

  const snippets = Object.entries(SNIPPET_LANGUAGES).flatMap(
    ([name, languages]) =>
      languages.map((language) => ({
        language,
        path: `./snippets/${name}.json`,
      })),
  )

  if (
    JSON.stringify(manifest.contributes.snippets) === JSON.stringify(snippets)
  )
    return

  manifest.contributes.snippets = snippets

  await writeFile(manifestPath, `${JSON.stringify(manifest, undefined, 2)}\n`)
}

await copySharedEntries()
await writeGeneratedSnippets()
await writeSnippetContributions()
