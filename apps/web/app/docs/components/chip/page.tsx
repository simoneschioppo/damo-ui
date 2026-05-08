import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Chip } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Chip } from '@damo/ui'`

const VARIANTS_SNIPPET = `<Chip>Default</Chip>
<Chip variant="accent">Accent</Chip>
<Chip variant="brand">Brand</Chip>
<Chip variant="success">Success</Chip>
<Chip variant="warning">Warning</Chip>
<Chip variant="danger">Danger</Chip>`

const SIZES_SNIPPET = `<Chip size="sm">Small</Chip>
<Chip size="md">Medium</Chip>
<Chip size="lg">Large</Chip>`

const DOT_SNIPPET = `<Chip dotColor="var(--success)">Active</Chip>
<Chip dotColor="var(--destructive)">Offline</Chip>
<Chip active dotColor="var(--primary)">Selected</Chip>`

export const metadata = { title: `Chip — ${BRAND.libName}` }

export default async function ChipDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'variant',
      type: "'default' | 'accent' | 'brand' | 'success' | 'warning' | 'danger'",
      defaultValue: "'default'",
      description: t.rich('componentDocs.chip.props.variant', { code: codeTag }),
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: t.rich('componentDocs.chip.props.size', { code: codeTag }),
    },
    {
      name: 'dotColor',
      type: 'string',
      description: t.rich('componentDocs.chip.props.dotColor', { code: codeTag }),
    },
    {
      name: 'active',
      type: 'boolean',
      description: t.rich('componentDocs.chip.props.active', { code: codeTag }),
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: t.rich('componentDocs.chip.props.children', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('feedback')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Chip</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.chip.lead', { link1: linkTag('/docs/components/badge') })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('variants')}</h2>
      <Example code={VARIANTS_SNIPPET}>
        <div className="flex flex-wrap gap-2">
          <Chip>Default</Chip>
          <Chip variant="accent">Accent</Chip>
          <Chip variant="brand">Brand</Chip>
          <Chip variant="success">Success</Chip>
          <Chip variant="warning">Warning</Chip>
          <Chip variant="danger">Danger</Chip>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('sizes')}</h2>
      <Example code={SIZES_SNIPPET}>
        <div className="flex flex-wrap items-center gap-2">
          <Chip size="sm">Small</Chip>
          <Chip size="md">Medium</Chip>
          <Chip size="lg">Large</Chip>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Status dot + active</h2>
      <Example code={DOT_SNIPPET}>
        <div className="flex flex-wrap gap-2">
          <Chip dotColor="var(--success)">Active</Chip>
          <Chip dotColor="var(--destructive)">Offline</Chip>
          <Chip active dotColor="var(--primary)">
            Selected
          </Chip>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Chip props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.chip.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.chip.a11y.1', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/badge" className="text-primary underline">
          ← Badge
        </Link>
        <Link href="/docs/components/hint" className="text-primary underline">
          Hint →
        </Link>
      </div>
    </article>
  )
}
