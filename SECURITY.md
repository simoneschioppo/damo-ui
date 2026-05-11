# Security policy

## Supported versions

While `damo-ui` is in the `0.x` preview range, only the **latest published version** receives security fixes. Older `0.x` versions will not be patched; consumers must upgrade.

Once `1.0.0` ships, this section will document the support window per major version.

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

- Vulnerabilities in code published to the npm package `damo-ui` (the contents of `packages/ui/dist/`).
- Supply-chain issues introduced via the build pipeline (`packages/ui/tsup.config.ts`, `scripts/post-build.mjs`, GitHub Actions workflows).

Out of scope:

- The `apps/web` docs site and the `e2e/` Playwright workspace (private monorepo packages, never published).
- Issues in third-party dependencies — please report those upstream and link the upstream advisory here.
- Self-XSS, attacks requiring physical access, social engineering of the maintainer.

## Acknowledgements

Researchers who follow this policy will be credited in the relevant release notes unless they request anonymity.
