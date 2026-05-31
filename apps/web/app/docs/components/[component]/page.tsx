import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DOCS_NAV } from '../../_components/docs-nav'
import { BRAND } from '../../../../lib/brand'

interface PageProps {
  params: Promise<{ component: string }>
}

function findEntry(slug: string) {
  for (const group of DOCS_NAV) {
    const entry = group.entries.find((e) => e.slug === `/docs/components/${slug}`)
    if (entry) return { entry, group }
  }
  return null
}

export async function generateStaticParams() {
  // Pre-render every stub so static export covers the full inventory. Real
  // pages have their own page.tsx files and take precedence over this dynamic
  // route at build time.
  return DOCS_NAV.flatMap((group) =>
    group.entries
      .filter((e) => e.status === 'stub')
      .map((e) => ({ component: e.slug.replace('/docs/components/', '') })),
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { component } = await params
  const found = findEntry(component)
  return {
    title: found ? `${found.entry.label} — ${BRAND.libName}` : `Component — ${BRAND.libName}`,
  }
}

export default async function ComponentStubPage({ params }: PageProps) {
  const { component } = await params
  const found = findEntry(component)

  if (!found) notFound()

  const { entry, group } = found

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {group.title.toUpperCase()}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">{entry.label}</h1>
      <div className="inline-block px-2 py-1 text-[10px] font-mono uppercase tracking-[0.18em] border-2 border-memphis bg-card text-muted-foreground mb-8">
        Documentation in progress
      </div>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-8">
        The <code className="font-mono">{entry.label}</code> component is part of the{' '}
        <strong>{BRAND.libName}</strong> library and is fully implemented. A dedicated documentation
        page with live previews, prop tables and accessibility notes is on the way.
      </p>
      <p className="text-foreground/85 mb-3">In the meantime you can:</p>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Import it directly:{' '}
          <code className="font-mono bg-card border-2 border-memphis px-2 py-0.5">
            {`import { ${entry.label} } from '@axologic/ui'`}
          </code>
        </li>
        <li>
          Browse the live Storybook stories at <code className="font-mono">pnpm dev</code> → Ladle
          on port 61000.
        </li>
        <li>
          Inspect the source under{' '}
          <code className="font-mono">packages/ui/src/components/{component}/</code>.
        </li>
      </ul>
      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/getting-started" className="text-primary underline">
          ← Getting Started
        </Link>
        <Link href="/docs/components/button" className="text-primary underline">
          Documented components →
        </Link>
      </div>
    </article>
  )
}
