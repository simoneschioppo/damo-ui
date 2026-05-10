import { highlightCode } from './highlight'
import { CopyButton } from './CopyButton'

export type CodeLang = 'tsx' | 'ts' | 'jsx' | 'bash' | 'css' | 'json' | 'html'

export interface CodeProps {
  readonly code: string
  readonly lang?: CodeLang
  readonly title?: string
  readonly hideCopy?: boolean
  /**
   * When true, drops the outer Memphis frame + spacing so the block can be
   * embedded inside another framed surface (e.g. `<Example>`).
   */
  readonly embedded?: boolean
  /**
   * When true, the block stretches vertically to fill its parent flex
   * container (used by the home QUICK INSTALL cards so all 3 terminals
   * align at the same height regardless of snippet line count).
   */
  readonly fillHeight?: boolean
  /**
   * Explicit override for the line-numbers gutter. When omitted, the heuristic
   * `isMultiLine(code)` decides — works for the common cases but mis-fires on
   * snippets that open with a leading newline (e.g. a template literal that
   * starts on the line of the backtick). Set explicitly when the heuristic
   * gets it wrong.
   */
  readonly withLineNumbers?: boolean
}

const LANG_LABEL: Record<CodeLang, string> = {
  tsx: 'TSX',
  ts: 'TS',
  jsx: 'JSX',
  bash: 'BASH',
  css: 'CSS',
  json: 'JSON',
  html: 'HTML',
}

// Single-line snippets (e.g. `pnpm add damo-ui`) skip the line-numbers gutter
// — a "1." next to a one-liner reads as visual noise.
function isMultiLine(code: string): boolean {
  return code.trimEnd().includes('\n')
}

export async function Code({
  code,
  lang = 'tsx',
  title,
  hideCopy = false,
  embedded = false,
  fillHeight = false,
  withLineNumbers,
}: CodeProps) {
  const showLineNumbers = withLineNumbers ?? isMultiLine(code)
  const html = await highlightCode(code, lang, { withLineNumbers: showLineNumbers })
  const wrapperBase = embedded
    ? 'damo-code damo-code--embedded'
    : 'damo-code damo-code--framed my-4 border-2 border-memphis shadow-memphis'
  const wrapperClass = fillHeight
    ? `${wrapperBase} damo-code--fill flex-1 flex flex-col`
    : wrapperBase
  return (
    <div className={wrapperClass} data-lang={lang}>
      <div className="damo-code__header">
        <div className="damo-code__tab-wrap">
          {title !== undefined && (
            <span className="damo-code__tab" title={title}>
              {title}
            </span>
          )}
        </div>
        <div className="damo-code__actions">
          <span className="damo-code__lang" aria-hidden>
            {LANG_LABEL[lang]}
          </span>
          {!hideCopy && <CopyButton text={code} />}
        </div>
      </div>
      {/*
        dangerouslySetInnerHTML is intentional and safe here:
          1. `html` is the output of Shiki's `codeToHtml`, which runs only in
             the server boundary (highlight.ts has `import 'server-only'`).
          2. `code` is always passed in as a hard-coded string literal from a
             docs page — it is never derived from user input or URL params.
          3. The `lang` value is constrained to the `CodeLang` union and is
             additionally regex-stripped inside `highlight.ts` before being
             written into the rendered `<pre data-lang="…">` attribute.
        Future refactors must preserve all three properties, otherwise this
        becomes an XSS sink.
      */}
      <div
        className={`damo-code__viewport${fillHeight ? ' flex-1' : ''}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
