import { defineConfig } from "tsdown"

export default defineConfig({
  deps: { alwaysBundle: [/^@vue3-snippets\//], neverBundle: [/^vscode$/] },
  minify: true,
})
