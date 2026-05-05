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

const dotClass = 'inline-block w-2.5 h-2.5 rounded-full'

export async function Code({
  code,
  lang = 'tsx',
  title,
  hideCopy = false,
  embedded = false,
}: CodeProps) {
  const html = await highlightCode(code, lang)
  const wrapperClass = embedded
    ? 'bg-[#0d1117] overflow-hidden'
    : 'my-4 border-2 border-memphis bg-[#0d1117] shadow-memphis overflow-hidden'
  return (
    <div className={wrapperClass}>
      <div className="flex items-center justify-between gap-3 px-3 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0" aria-hidden>
            <span className={`${dotClass} bg-[#ff5f57]`} />
            <span className={`${dotClass} bg-[#febc2e]`} />
            <span className={`${dotClass} bg-[#28c840]`} />
          </div>
          {title !== undefined && (
            <span className="font-mono text-[11px] tracking-[0.12em] text-[#c9d1d9] truncate">
              {title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10px] tracking-[0.15em] text-[#7d8590] uppercase">
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
        className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
