import type { ReactNode } from 'react'
import { Code } from './Code'

export interface ExampleProps {
  readonly children: ReactNode
  readonly code: string
  readonly title?: string
  readonly previewClassName?: string
}

export function Example({ children, code, title, previewClassName }: ExampleProps) {
  return (
    <div className="my-6">
      {title !== undefined && (
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
          {title}
        </div>
      )}
      <div className="border-2 border-memphis bg-background shadow-memphis">
        <div
          className={
            previewClassName !== undefined
              ? previewClassName
              : 'px-6 py-10 flex items-center justify-center gap-4 flex-wrap'
          }
        >
          {children}
        </div>
        <div className="border-t-2 border-memphis">
          <Code code={code} lang="tsx" hideCopy={false} />
        </div>
      </div>
    </div>
  )
}
