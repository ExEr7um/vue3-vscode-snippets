---
name: git-conventions
description: Commit and Pull Request formatting rules for this repository. ALWAYS use before creating a commit (`git commit`) or a Pull Request (`gh pr create`), and when wording commit and PR titles and descriptions — even if the task is phrased as "commit this", "make a PR" or "push the changes".
---

# Git conventions

## Commit message

- Follow **Conventional Commits**: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`, etc. Add a scope when changing a specific module/area (e.g. ``feat(vue): Add `Suspense` vue-html snippet``).
- Use English.
- Start the description after the colon with a capitalized verb in the imperative mood: `Add`, `Update`, `Setup`, `Remove`, `Enable`, `Disable`, `Create`, `Rework`, `Improve`, `Use`, `Adapt`.
- Don't use the past tense or the third person: not `Added`, not `Fixed`, not `Updates`, not `Removed`.
- The `Add` action can be omitted when the commit is `feat:` and the addition is obvious from the subject itself. For example, not `feat: Add legal documents section`, but `feat: Legal documents section`.
- Keep the subject short and specific.
- Wrap file names, packages, components, configs and technical identifiers in backticks: `README.md`, `vbase`, `tsdown`, `blockOrder`.
- Try not to write a description (body) — the commit message should speak for itself. Use it only as a last resort.

## Pull Request

- Pull Requests are always merged via Squash & Merge, so their titles must fully follow the commit message standards described above.
- The description must be as short and meaningful as possible. It should describe only the changes made to the code.
- When creating a PR, set the appropriate Labels and assign @ExEr7um as the Assignee.
