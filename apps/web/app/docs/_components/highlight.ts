import 'server-only'
import { createHighlighter, type Highlighter } from 'shiki'

const SUPPORTED_LANGS = ['tsx', 'ts', 'jsx', 'bash', 'css', 'json', 'html'] as const
type SupportedLang = (typeof SUPPORTED_LANGS)[number]

// Code blocks read better in a single, always-dark theme that matches a
// terminal/IDE — independent of whether the surrounding page is in light or
// dark mode. The wrapping `<Code>` chrome handles the contrast against the
// page background.
const CODE_THEME = 'github-dark-default'

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter(): Promise<Highlighter> {
  if (highlighterPromise === null) {
    highlighterPromise = createHighlighter({
      themes: [CODE_THEME],
      langs: [...SUPPORTED_LANGS],
    })
  }
  return highlighterPromise
}

function resolveLang(lang: string): SupportedLang {
  return (SUPPORTED_LANGS as ReadonlyArray<string>).includes(lang) ? (lang as SupportedLang) : 'tsx'
}

export async function highlightCode(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter()
  const resolved = resolveLang(lang)
  const html = highlighter.codeToHtml(code, {
    lang: resolved,
    theme: CODE_THEME,
  })
  const safeLang = lang.replace(/[^a-z0-9-]/gi, '')
  return html.replace('<pre ', `<pre data-lang="${safeLang}" `)
}
