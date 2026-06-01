# Security policy

## Supported versions

`damo-ui` (the CLI) is at `1.x`. Only the **latest published version** receives security fixes; consumers should stay current. The legacy `damo-ui@0.x` _library_ line is deprecated and not patched — migrate via `npx damo-ui codemod migrate-from-npm`.

## Reporting a vulnerability

If you believe you have found a security issue in `damo-ui`:

1. **Do not open a public GitHub issue.**
2. Send a private report to the maintainer via GitHub Security Advisories:
   <https://github.com/simoneschioppo/damo-ui/security/advisories/new>
3. Include a clear description, reproduction steps, affected versions, and the impact you observed.

You can expect:

- An acknowledgement within **5 business days**.
- A status update within **15 business days** with either a fix plan or an explanation of why we consider the report out of scope.
- A coordinated disclosure once a fix is published.

## Scope

In scope:

- Vulnerabilities in code published to the npm package `damo-ui` — the CLI (the contents of `packages/cli/src/`).
- The component source the CLI distributes from the registry (`packages/ui/src/`, served at `https://damo-ui.com/r`).
- Supply-chain issues introduced via the publish/CI pipeline (`.github/workflows/`).

Out of scope:

- The `apps/web` docs site, the `e2e/` Playwright workspace, and the private (unpublished) `@axologic/ui` / `@axologic/mcp` packages.
- Issues in third-party dependencies — please report those upstream and link the upstream advisory here.
- Self-XSS, attacks requiring physical access, social engineering of the maintainer.

## Acknowledgements

Researchers who follow this policy will be credited in the relevant release notes unless they request anonymity.
