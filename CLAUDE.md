# damacchi-ui — Project Instructions for Claude / AI Agents

This is a TypeScript monorepo:
- `packages/ui/` — `damo-ui` component library (currently published via
  GitHub Packages; long-term goal: shadcn/ui-style copy-paste on npm).
- `apps/web/` — Next.js docs site **and** theme generator for the library.

## Kipi — Core-Knowledge Keeper (handshake protocol)

This project ships a documentation-architect agent named **Kipi** at
`_bmad/agents/kipi/kipi.md`. Kipi owns the structured deep documentation
under `core-knowledge/`.

### When to invoke the handshake

After **any** code change that touches files Kipi tracks (start with
`packages/ui/**` and `apps/web/**`, plus root build/config files), suggest
running the `kipi-update` skill at `_bmad/agents/kipi/SKILL.md`.

The handshake **does not** modify `core-knowledge/`. It only queues an
update so the user can later run Kipi `*4 Update Knowledge` and approve
the edits.

### How to invoke

After your change lands:

> 📚 Heads up: I touched `<paths>`. Suggest invoking `kipi-update` so the
> knowledge base is queued for sync. Want me to run it?

If the user says yes, follow `_bmad/agents/kipi/SKILL.md`: identify
changed paths, append to `_bmad/agents/kipi/workflow-state.json` under
`workflows.update.queued[]`, and stop.

### Hard rules

- ❌ **Never** edit files inside `core-knowledge/` directly. Route every
  knowledge change through Kipi's workflows.
- ❌ **Never** auto-run Kipi `*4 Update Knowledge` without explicit user
  consent.
- ❌ **Never** treat `user-data/` as code — it's a drop-zone for raw
  knowledge processed by Kipi `*3`.
- ✅ The handshake is a one-line queue update + user nudge, nothing more.

## Working language

The user (`simoneschioppo`) works in Italian. Mirror Italian in
conversation. Keep `core-knowledge/` content in **English** for long-term
portability.
