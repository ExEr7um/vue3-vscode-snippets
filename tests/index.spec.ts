import { beforeEach, describe, expect, test } from "vitest"

import { activate } from "../src/index"
import { languages } from "./mocks/vscode"

describe("activate", () => {
  beforeEach(() => {
    languages.registerCompletionItemProvider.mockClear()
  })

  test("registers every configurable snippet for its languages", () => {
    activate({ subscriptions: [] } as never)

    const languagesRegistered =
      languages.registerCompletionItemProvider.mock.calls.map(
        ([language]) => language,
      )

    expect(languagesRegistered).toContain("vue")
    expect(languagesRegistered).toContain("javascript")
    expect(languagesRegistered).toContain("typescript")
  })
})
