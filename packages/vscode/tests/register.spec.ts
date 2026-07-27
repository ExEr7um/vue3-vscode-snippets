import type { CompletionItem, CompletionItemProvider } from "vscode"

import { beforeEach, describe, expect, test } from "vitest"

import type { ConfigurableSnippet } from "../src/types"

import { registerConfigurableSnippet } from "../src/register"
import { languages } from "./mocks/vscode"

const snippet: ConfigurableSnippet = {
  buildBody: () => "BODY",
  detail: "Fake snippet",
  languages: ["vue", "typescript"],
  prefix: "fake",
  section: "vueSnippets.fake",
}

/**
 * Registers {@link snippet} and returns the recorded provider registrations.
 *
 * @returns The `[language, provider]` pairs passed to VS Code.
 */
function register(): [string, CompletionItemProvider][] {
  const subscriptions: unknown[] = []

  registerConfigurableSnippet({ subscriptions } as never, snippet)

  return languages.registerCompletionItemProvider.mock.calls as [
    string,
    CompletionItemProvider,
  ][]
}

describe("registerConfigurableSnippet", () => {
  beforeEach(() => {
    languages.registerCompletionItemProvider.mockClear()
  })

  test("registers a provider for every language", () => {
    const languagesRegistered = register().map(([language]) => language)

    expect(languagesRegistered).toStrictEqual(["vue", "typescript"])
  })

  test("builds a completion item from the snippet definition", () => {
    const [[, provider]] = register()

    const [item] = provider.provideCompletionItems(
      undefined as never,
      undefined as never,
      undefined as never,
      undefined as never,
    ) as CompletionItem[]

    expect(item.label).toBe("fake")
    expect((item.insertText as { value: string }).value).toBe("BODY")
    expect(item.detail).toBe("Fake snippet")
    expect((item.documentation as { value: string }).value).toContain(
      "vueSnippets.fake",
    )
  })
})
