import { definePackConfig } from "@exer7um/vp-config"
import { defineConfig } from "vite-plus"

export default defineConfig({
  pack: definePackConfig({
    deps: { alwaysBundle: [/^@vue3-snippets\//], neverBundle: [/^vscode$/] },
  }),
})
