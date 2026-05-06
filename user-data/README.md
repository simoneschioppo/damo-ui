# user-data/

Drop-zone for raw project knowledge that Kipi will process.

**What goes here:** notes, specs, diagrams, meeting transcripts, screenshots,
exported chats, decision logs, design briefs — anything relevant to the
damo-ui library or the docs/theme-generator app that isn't already source
code.

**What does NOT go here:** source code (lives in `packages/`, `apps/`),
secrets, anything you wouldn't commit.

## How Kipi processes this folder

Run **Kipi → `*3 Process User Data`**. Kipi will:

1. List unprocessed files.
2. Propose a classification for each (library / theming / web / generator
   / publishing / decision-log / unclear).
3. After your approval, extract structured Markdown and save it to
   `core-knowledge/ready-for-classify/` with a dated, classified filename.
4. Move the original here under `_archive/<date>/`.
5. Suggest which existing chapters the new content should be merged into
   (run `*4 Update Knowledge` to merge).

Kipi never deletes originals — they're archived, not removed.
