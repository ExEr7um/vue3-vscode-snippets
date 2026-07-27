import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      vscode: fileURLToPath(
        new URL("packages/vscode/tests/mocks/vscode.ts", import.meta.url),
      ),
    },
  },
})
