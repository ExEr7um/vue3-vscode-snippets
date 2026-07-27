import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

/** Repository root, resolved from this script's location. */
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")

/** Manifest of the VS Code extension package. */
const MANIFEST = path.join(ROOT, "packages", "vscode", "package.json")

/**
 * Reads a JSON manifest from disk.
 *
 * @param file Absolute path of the manifest.
 * @returns The parsed manifest.
 */
async function readJson(file: string): Promise<{ version: string }> {
  return JSON.parse(await readFile(file, "utf8")) as { version: string }
}

const { version } = await readJson(path.join(ROOT, "package.json"))
const manifest = await readJson(MANIFEST)

if (manifest.version !== version) {
  manifest.version = version

  await writeFile(MANIFEST, `${JSON.stringify(manifest, undefined, 2)}\n`)
}
