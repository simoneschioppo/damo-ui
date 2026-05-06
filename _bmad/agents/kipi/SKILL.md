---
name: kipi-update
description: |
  Handshake skill — invoked by *other* agents (or the user) right after code
  changes land, to keep Kipi's core-knowledge/ in sync with reality.
  Does NOT activate the full Kipi agent. It only queues an update request.
trigger: |
  Use after committing or staging code changes that touch packages/ui,
  apps/web, or any source tracked in core-knowledge/. Also use when a
  meeting note, spec, or transcript has just landed in user-data/.
---

# kipi-update — Knowledge Sync Handshake

## Why this skill exists

Kipi's hard rule is "no silent writes". So even after a code change, Kipi
still requires user approval to update chapters. This skill is the *signal*
that an update is needed — it does not perform the update.

## What it does

1. **Identify scope.** Determine the set of changed paths. Prefer:
   - `git diff --name-only HEAD~1 HEAD` if there's a fresh commit, or
   - `git diff --name-only --cached` if there are staged changes, or
   - the explicit path list passed by the calling agent.

2. **Filter to tracked sources.** Read
   `_bmad/agents/kipi/workflow-state.json` and keep only paths that appear
   in any chapter's `sources[]`. If the file does not exist, skip filtering.

3. **Append to the update queue.** Add to
   `_bmad/agents/kipi/workflow-state.json` under
   `workflows.update.queued[]`:

   ```json
   {
     "queued_at": "<ISO timestamp>",
     "trigger": "post-code-change | user-data-drop | manual",
     "paths": ["packages/ui/src/components/Button/Button.tsx", "..."],
     "source_agent": "<calling agent name or 'user'>"
   }
   ```

4. **Surface a one-line nudge** to the user:
   > 📚 Kipi: 3 paths queued for knowledge update. Run `*4` in Kipi to review.

5. **Stop.** Do not edit `core-knowledge/`. Do not call any other Kipi
   workflow. The user (or a subsequent Kipi activation) decides when to run
   `*4 Update Knowledge`.

## What it must NOT do

- ❌ Write to `core-knowledge/`.
- ❌ Activate the full Kipi agent.
- ❌ Auto-run `*4` without user consent.
- ❌ Modify any source file.

## Calling convention

Other agents invoke this skill conceptually as:

```
invoke skill: kipi-update
  paths: [<changed paths>]
  trigger: post-code-change
```

If invoked without `paths`, the skill derives them from `git diff` as in
step 1. If invoked without `trigger`, default to `manual`.
