# Publishing Model

Status: pending

## Intended scope
The current and target distribution models for `damo-ui`. Today the
library is consumed as a published package (via GitHub Packages); the
long-term goal is a shadcn/ui-style copy-paste flow on npm. Document
both modes and the migration path.

## TOC (stub)
- Today: GitHub Packages (auth, install, versioning)
- Tomorrow: shadcn-style copy-paste on npm
- Per-component "How to consume" expectations
- Versioning, changelog, and release cadence
- Constraints implied by copy-paste distribution (zero-runtime, no global
  state, explicit dependencies)
