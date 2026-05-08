import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'

export interface PropDef {
  readonly name: string
  readonly type: string
  readonly defaultValue?: string
  readonly required?: boolean
  readonly description: ReactNode
}

export interface PropsTableProps {
  readonly props: ReadonlyArray<PropDef>
  readonly caption?: string
}

const cellClass = 'px-4 py-3 align-top border-b border-memphis/40 last:border-b-0'

export async function PropsTable({ props, caption }: PropsTableProps) {
  const t = await getTranslations('docsChrome.propsTable')
  return (
    <div className="my-6 border-2 border-memphis bg-card shadow-memphis overflow-x-auto">
      {caption !== undefined && (
        <div className="border-b-2 border-memphis px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {caption}
        </div>
      )}
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="border-b-2 border-memphis bg-muted/40">
            <th
              className={`${cellClass} text-left font-mono uppercase tracking-[0.12em] text-[11px]`}
            >
              {t('prop')}
            </th>
            <th
              className={`${cellClass} text-left font-mono uppercase tracking-[0.12em] text-[11px]`}
            >
              {t('type')}
            </th>
            <th
              className={`${cellClass} text-left font-mono uppercase tracking-[0.12em] text-[11px]`}
            >
              {t('default')}
            </th>
            <th
              className={`${cellClass} text-left font-mono uppercase tracking-[0.12em] text-[11px]`}
            >
              {t('description')}
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name}>
              <td
                className={`${cellClass} font-mono font-semibold text-foreground whitespace-nowrap`}
              >
                {p.name}
                {p.required === true && <span className="ml-1 text-primary">*</span>}
              </td>
              <td className={`${cellClass} font-mono text-secondary`}>{p.type}</td>
              <td className={`${cellClass} font-mono text-muted-foreground`}>
                {p.defaultValue !== undefined ? p.defaultValue : '—'}
              </td>
              <td className={`${cellClass} text-foreground`}>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
