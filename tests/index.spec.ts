import { beforeEach, describe, expect, test } from "vitest"

import { activate } from "../src/index"
import { languages } from "./mocks/vscode"

describe("activate", () => {
  beforeEach(() => {
    languages.registerCompletionItemProvider.mockClear()
  })

  test("registers the vbase completion for vue files", () => {
    activate({ subscriptions: [] } as never)

    const languagesRegistered =
      languages.registerCompletionItemProvider.mock.calls.map(
        ([language]) => language,
      )

    expect(languagesRegistered).toContain("vue")
  })
})
