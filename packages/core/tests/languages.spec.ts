import { readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, test } from "vitest"

import { GENERATED_SNIPPETS, SNIPPET_LANGUAGES } from "../src/languages"

/** Directory holding the hand-written snippet files. */
const SNIPPETS = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "snippets",
)

/**
 * Lists the hand-written snippet files, relative to the `snippets` directory
 * and without the `.json` extension.
 *
 * @returns The sorted file names.
 */
async function readSnippetFiles(): Promise<string[]> {
  const entries = await readdir(SNIPPETS, {
    recursive: true,
    withFileTypes: true,
  })

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) =>
      path
        .join(path.relative(SNIPPETS, entry.parentPath), entry.name)
        .replace(".json", ""),
    )
    .toSorted((left, right) => left.localeCompare(right))
}

describe("SNIPPET_LANGUAGES", () => {
  test("registers every hand-written snippet file", async () => {
    const mapped = Object.keys(SNIPPET_LANGUAGES)
      .filter((name) => !GENERATED_SNIPPETS.includes(name))
      .toSorted((left, right) => left.localeCompare(right))

    expect(mapped).toStrictEqual(await readSnippetFiles())
  })

  test("registers every generated snippet file", () => {
    for (const name of GENERATED_SNIPPETS) {
      expect(SNIPPET_LANGUAGES[name]).toBeDefined()
    }
  })
})
