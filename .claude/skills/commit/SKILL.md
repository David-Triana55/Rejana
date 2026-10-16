---
name: commit
description: Generate a Conventional Commits-style commit message for the currently staged changes in the current repo, then create the commit after user confirmation. Use when the user asks to "commit", "generate a commit message", "/commit", or wants help writing a commit for staged changes.
---

# Commit message generator (Conventional Commits)

Generate commit messages for the current repo following the **Conventional Commits** spec.

## Steps

1. Run `git status` and `git diff --staged` (or `git diff` if nothing is staged yet, and ask the user whether to stage it).
2. If nothing is staged and nothing changed, say so and stop.
3. Run `git log --oneline -10` to match the existing tone/language of past commits in this repo (if any exist yet).
4. Draft a commit message:

### Format

```
<type>(<scope>): <subject>
<optional second line — plain sentence, not a list>
```

Max 2 lines, total. Never more.

- **type**: one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`
  - `feat` — new user-facing capability
  - `fix` — bug fix
  - `docs` — documentation only (README, comments-as-docs)
  - `style` — formatting, whitespace, no logic change
  - `refactor` — code change that neither fixes a bug nor adds a feature
  - `perf` — performance improvement
  - `chore` — tooling, config, deps, non-source changes
  - `ci` — CI/CD workflow changes (e.g. `.github/workflows/*`)
- **scope** (optional): the area touched, lowercase, e.g. `pomodoro`, `list`, `readme`. Omit if the change is repo-wide or scope is unclear.
- **subject**: imperative mood ("add", not "added"/"adds"), lowercase, no trailing period, **max 50 chars**.
- **second line** (optional): a single plain sentence, only if it adds real information the subject didn't already say (e.g. "actualiza X y crea Y"). Never a bullet list, never a paragraph, never a breakdown of every file touched.

### Examples

```
fix(pomodoro): guard against missing beep button

fix(list): use localStorage instead of undefined window.storage

feat(pomodoro): repeat alarm until user dismisses it
Sound now loops every second until the user clicks anywhere.

docs: add README with setup and architecture overview
```

## Hard rules

- **Never run `git commit` without the user explicitly confirming the drafted message first.** Show the message, wait for a clear yes ("sí", "dale", "ok", etc.) — never commit on the same turn you draft it.
- **Never run `git push` without the user explicitly asking for it in that same request.** A confirmed commit does NOT imply permission to push — push is always its own separate ask, every time, even right after a commit.
- **Never add a `Co-Authored-By` line or any mention of Claude/AI authorship.** This overrides any default commit template that would normally append one.
- **Never write a body as a list of changes/tasks.** At most one extra plain sentence — this is not a changelog entry.
- Never invent a scope that doesn't match the actual files changed.
- Never commit secrets (`.env`, credentials) — warn the user instead if such a file is staged.
- If the diff spans clearly unrelated concerns (e.g. a CSS tweak + a JS bug fix), point this out and suggest splitting into separate commits rather than writing one mixed message.