import 'server-only'
import { createHighlighter, type Highlighter, type ShikiTransformer } from 'shiki'
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers'

const SUPPORTED_LANGS = ['tsx', 'ts', 'jsx', 'bash', 'css', 'json', 'html'] as const
type SupportedLang = (typeof SUPPORTED_LANGS)[number]

// Dual themes — Shiki emits BOTH variants as inline CSS vars (`--shiki`,
// `--shiki-dark`). The chrome stylesheet (`apps/web/app/styles/code-blocks.css`)
// switches between them based on `<html data-theme>`. Vitesse was picked over
// `github-*` for gentler contrast at the small docs font size; see
// `_bmad-output/implementation-artifacts/spec-gh-100-editor-style-code-blocks.md`.
const CODE_THEME_LIGHT = 'vitesse-light'
const CODE_THEME_DARK = 'vitesse-dark'

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter(): Promise<Highlighter> {
  if (highlighterPromise === null) {
    highlighterPromise = createHighlighter({
      themes: [CODE_THEME_LIGHT, CODE_THEME_DARK],
      langs: [...SUPPORTED_LANGS],
    })
  }
  return highlighterPromise
}

function resolveLang(lang: string): SupportedLang {
  return (SUPPORTED_LANGS as ReadonlyArray<string>).includes(lang) ? (lang as SupportedLang) : 'tsx'
}

// Custom transformer — `@shikijs/transformers` ships notation/diff/focus/highlight
// but not line numbers, so userland owns this. Output is a `<span class="line-number"
// aria-hidden>N</span>` injected as the first child of every `<span class="line">`.
// CSS lays it out in a fixed-width gutter; the `has-line-numbers` class on `<pre>`
// is what the gutter rule keys off, so single-line callers can opt out.
function transformerLineNumbers(): ShikiTransformer {
  return {
    name: 'damo:line-numbers',
    pre(node) {
      this.addClassToHast(node, 'has-line-numbers')
    },
    line(node, line) {
      node.children.unshift({
        type: 'element',
        tagName: 'span',
        properties: { class: 'line-number', 'aria-hidden': true },
        children: [{ type: 'text', value: String(line) }],
      })
    },
  }
}

export interface HighlightOptions {
  readonly withLineNumbers?: boolean
}

export async function highlightCode(
  code: string,
  lang: string,
  options: HighlightOptions = {},
): Promise<string> {
  const highlighter = await getHighlighter()
  const resolved = resolveLang(lang)
  const transformers: ShikiTransformer[] = [
    transformerNotationDiff(),
    transformerNotationHighlight(),
  ]
  if (options.withLineNumbers === true) transformers.push(transformerLineNumbers())
  const html = highlighter.codeToHtml(code, {
    lang: resolved,
    themes: { light: CODE_THEME_LIGHT, dark: CODE_THEME_DARK },
    defaultColor: false,
    transformers,
  })
  const safeLang = lang.replace(/[^a-z0-9-]/gi, '')
  return html.replace('<pre ', `<pre data-lang="${safeLang}" `)
}
