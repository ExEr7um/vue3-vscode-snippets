import type { ConfigurableSnippet } from "@vue3-snippets/core"
import type { CompletionItem, CompletionItemProvider } from "vscode"

import { defineSnippet } from "@vue3-snippets/core"
import { beforeEach, describe, expect, test } from "vitest"

import { registerConfigurableSnippet } from "../src/register"
import { languages, setSettings } from "./mocks/vscode"

const snippet: ConfigurableSnippet = defineSnippet<{
  loud: boolean
  what: string
}>({
  buildBody: (config) => `${config.what}${config.loud ? "!" : ""}`,
  defaults: { loud: false, what: "BODY" },
  detail: "Fake snippet",
  languages: ["vue", "typescript"],
  normalize: (config) => ({ ...config, what: config.what.toUpperCase() }),
  prefix: "fake",
  section: "vueSnippets.fake",
  settings: [
    { key: "loud", markdownDescription: "Shout." },
    { key: "what", markdownDescription: "What to say." },
  ],
  variants: [
    {
      config: { loud: true },
      description: "A loud fake snippet",
      name: "Fake Loud",
      suffix: "loud",
    },
  ],
})

/**
 * Builds the completion item the first registered provider offers.
 *
 * @returns The inserted snippet body.
 */
function complete(): string {
  const [[, provider]] = register()

  const [item] = provider.provideCompletionItems(
    undefined as never,
    undefined as never,
    undefined as never,
    undefined as never,
  ) as CompletionItem[]

  return (item?.insertText as { value: string }).value
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
    setSettings({})
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

    expect(item?.label).toBe("fake")
    expect(item?.detail).toBe("Fake snippet")
    expect((item?.documentation as { value: string }).value).toContain(
      "vueSnippets.fake",
    )
  })

  test("falls back to the defaults when nothing is configured", () => {
    expect(complete()).toBe("BODY")
  })

  test("reads every setting of the section", () => {
    setSettings({ loud: true, what: "hello" })

    expect(complete()).toBe("HELLO!")
  })
})
