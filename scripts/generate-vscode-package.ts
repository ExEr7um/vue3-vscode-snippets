import type { ConfigurationProperty } from "@vue3-snippets/core"

import {
  buildConfigurationProperties,
  collectSnippetLanguages,
  GENERATED_FILES,
  SNIPPET_LANGUAGES,
} from "@vue3-snippets/core"
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

interface Manifest {
  activationEvents: string[]
  contributes: {
    configuration: { properties: Record<string, ConfigurationProperty> }
    snippets: { language: string; path: string }[]
  }
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

/**
 * Mirrors the shared repository files into the VS Code package.
 *
 * Every entry is dropped before being copied: copying alone would leave files
 * that have since been renamed or deleted behind, and `vsce` would pack them.
 *
 * @returns A promise resolved once every entry is copied.
 */
async function copySharedEntries(): Promise<void> {
  await Promise.all(
    SHARED_ENTRIES.map(async (entry) => {
      const target = path.join(TARGET, entry)

      await rm(target, { force: true, recursive: true })
      await cp(path.join(ROOT, entry), target, { recursive: true })
    }),
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
 * Rewrites the generated parts of the extension manifest: the settings schema,
 * the activation events and the snippet file contributions. Every one of them
 * comes from the snippet definitions, so they cannot drift from the builders.
 *
 * @returns A promise resolved once the manifest is up to date.
 */
async function writeManifest(): Promise<void> {
  const manifestPath = path.join(TARGET, "package.json")
  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Manifest
  const previous = JSON.stringify(manifest)

  manifest.activationEvents = collectSnippetLanguages().map(
    (language) => `onLanguage:${language}`,
  )
  manifest.contributes.configuration.properties = buildConfigurationProperties()
  manifest.contributes.snippets = Object.entries(SNIPPET_LANGUAGES).flatMap(
    ([name, languages]) =>
      languages.map((language) => ({
        language,
        path: `./snippets/${name}.json`,
      })),
  )

  if (JSON.stringify(manifest) === previous) return

  await writeFile(manifestPath, `${JSON.stringify(manifest, undefined, 2)}\n`)
}

await copySharedEntries()
await writeGeneratedSnippets()
await writeManifest()
