# Library Architecture

Status: pending

## Intended scope
Bird's-eye view of `packages/ui`: its source-tree layout, the public
entry point (`src/index.ts`), how subdirectories (`components/`,
`hooks/`, `icons/`, `lib/`, `styles/`, `mocks/`) compose, and the
invariants that hold across the library.

## TOC (stub)
- Source tree map
- Public entry point and exports surface
- Internal vs. public modules
- Cross-module dependencies and rules
- Key invariants (immutability, no global state, no side-effectful imports)
