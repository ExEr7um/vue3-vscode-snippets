import { cp, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

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
 * Reads a JSON manifest from disk.
 *
 * @param path Absolute path of the manifest.
 * @returns The parsed manifest.
 */
async function readJson(path: string): Promise<{ version: string }> {
  return JSON.parse(await readFile(path, "utf8")) as { version: string }
}

/**
 * Copies the repository version into the extension manifest, keeping the
 * published version in sync with the version `changelogen` bumps.
 *
 * @returns A promise resolved once the manifest is up to date.
 */
async function syncVersion(): Promise<void> {
  const manifestPath = path.join(TARGET, "package.json")

  const { version } = await readJson(path.join(ROOT, "package.json"))
  const manifest = await readJson(manifestPath)

  if (manifest.version === version) return

  manifest.version = version

  await writeFile(manifestPath, `${JSON.stringify(manifest, undefined, 2)}\n`)
}

await copySharedEntries()
await syncVersion()
