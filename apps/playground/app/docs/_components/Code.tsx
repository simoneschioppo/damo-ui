import { highlightCode } from './highlight'
import { CopyButton } from './CopyButton'

export interface CodeProps {
  readonly code: string
  readonly lang?: 'tsx' | 'ts' | 'jsx' | 'bash' | 'css' | 'json' | 'html'
  readonly title?: string
  readonly hideCopy?: boolean
}

export async function Code({ code, lang = 'tsx', title, hideCopy = false }: CodeProps) {
  const html = await highlightCode(code, lang)
  return (
    <div className="relative my-4 border-2 border-memphis bg-card shadow-memphis">
      {title !== undefined && (
        <div className="border-b-2 border-memphis px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </div>
      )}
      <div
        className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_pre]:!m-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {!hideCopy && <CopyButton text={code} />}
    </div>
  )
}
