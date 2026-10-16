import {
  defineCheckConfig,
  defineFmtConfig,
  defineLintConfig,
  defineStagedConfig,
} from "@exer7um/vp-config"
import { defineConfig } from "vite-plus"

export default defineConfig({
  check: defineCheckConfig(),
  fmt: defineFmtConfig(),
  lint: defineLintConfig(),
  staged: defineStagedConfig({}, { eslint: "*.{vue,js,jsx,cjs,mjs,ts,json}" }),
})
