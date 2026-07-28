import type { SnippetEntry } from "./types"

import { PSTORE } from "./pstore"
import { VBASE } from "./vbase"

/** Snippet files built from the configurable snippet definitions. */
export const GENERATED_FILES: Record<string, Record<string, SnippetEntry>> = {
  "generated/pstore": PSTORE.variants,
  "generated/vbase": VBASE.variants,
}
