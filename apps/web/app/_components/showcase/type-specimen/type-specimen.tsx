'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from 'damo-ui'

export interface TypeSpecimenScaleRow {
  readonly label: string
  readonly size: number
  readonly weight?: number
}

export interface TypeSpecimenProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Small mono eyebrow name (e.g. "Display / Audiowide"). */
  name: string
  /** Sample text rendered in the target fontFamily. */
  sample: string
  /** Target font-family CSS value (e.g. "var(--font-display)"). */
  fontFamily: string
  /** Font size in px for the sample text. Defaults to 28. */
  sampleSize?: number
  /** Optional meta table of size/weight rows rendered below the sample. */
  scale?: ReadonlyArray<TypeSpecimenScaleRow>
  className?: string
}

const DEFAULT_SAMPLE_SIZE = 28

// Single Memphis card that previews a typeface. Contains a mono eyebrow with
// the `name`, the `sample` rendered in the target `fontFamily` at `sampleSize`,
// and an optional meta table showing each scale entry's label/size/weight.
//
// The Memphis frame (2px border + default Memphis shadow) lives in inline
// style so the `--memphis-border-color` and `--shadow-memphis` tokens resolve
// correctly across themes.
export const TypeSpecimen = forwardRef<HTMLDivElement, TypeSpecimenProps>(function TypeSpecimen(
  { name, sample, fontFamily, sampleSize = DEFAULT_SAMPLE_SIZE, scale, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('p-8 relative', className)}
      style={{
        background: 'var(--card)',
        border: '2px solid var(--memphis-border-color)',
        boxShadow: 'var(--shadow-memphis)',
        ...style,
      }}
      {...rest}
    >
      <div className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">
        {name}
      </div>
      <p className="m-0 leading-none text-foreground" style={{ fontFamily, fontSize: sampleSize }}>
        {sample}
      </p>
      {scale && scale.length > 0 ? (
        <div className="mt-5 flex flex-col gap-2">
          {scale.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_auto] gap-4 items-baseline font-mono text-[11px] text-muted-foreground"
            >
              <span className="uppercase tracking-[0.15em] font-bold">{row.label}</span>
              <span className="text-primary font-bold text-right">
                {row.size}px{row.weight !== undefined ? ` / ${row.weight}` : ''}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
})
