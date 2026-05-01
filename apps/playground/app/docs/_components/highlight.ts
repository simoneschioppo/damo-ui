import 'server-only'
import { createHighlighter, type Highlighter } from 'shiki'

const SUPPORTED_LANGS = ['tsx', 'ts', 'jsx', 'bash', 'css', 'json', 'html'] as const
type SupportedLang = (typeof SUPPORTED_LANGS)[number]

const LIGHT_THEME = 'github-light'
const DARK_THEME = 'github-dark-default'

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter(): Promise<Highlighter> {
  if (highlighterPromise === null) {
    highlighterPromise = createHighlighter({
      themes: [LIGHT_THEME, DARK_THEME],
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
    themes: { light: LIGHT_THEME, dark: DARK_THEME },
    defaultColor: false,
  })
  const safeLang = lang.replace(/[^a-z0-9-]/gi, '')
  return html.replace('<pre ', `<pre data-lang="${safeLang}" `)
}
