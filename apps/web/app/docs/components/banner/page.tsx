import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import { Banner } from 'damo-ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Banner } from 'damo-ui'`

const VARIANTS_SNIPPET = `<Banner variant="info" title="Heads up">
  Your trial ends in 7 days. Upgrade to keep your projects.
</Banner>
<Banner variant="success" title="Saved">
  Settings have been updated.
</Banner>
<Banner variant="warning" title="Quota at 90%">
  You'll hit the storage cap by Friday.
</Banner>
<Banner variant="danger" title="Action required">
  Payment failed — update your card.
</Banner>`

const DISMISSIBLE_SNIPPET = `<Banner
  variant="info"
  title="Privacy update"
  dismissible
  onDismiss={() => trackBannerDismissed('privacy')}
>
  We've updated our privacy policy. Read what changed.
</Banner>`

const NO_ICON_SNIPPET = `<Banner variant="success" icon={false} title="Saved">
  Use icon={false} to drop the leading icon entirely.
</Banner>`

export const metadata = { title: `Banner — ${BRAND.libName}` }

export default async function BannerDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'variant',
      type: "'info' | 'success' | 'warning' | 'danger'",
      defaultValue: "'info'",
      description: t.rich('componentDocs.banner.props.variant', { code: codeTag }),
    },
    {
      name: 'title',
      type: 'ReactNode',
      description: t.rich('componentDocs.banner.props.title', { code: codeTag }),
    },
    {
      name: 'icon',
      type: 'ReactNode | false',
      description: t.rich('componentDocs.banner.props.icon', { code: codeTag }),
    },
    {
      name: 'dismissible',
      type: 'boolean',
      defaultValue: 'false',
      description: t.rich('componentDocs.banner.props.dismissible', { code: codeTag }),
    },
    {
      name: 'onDismiss',
      type: '() => void',
      description: t.rich('componentDocs.banner.props.onDismiss', { code: codeTag }),
    },
    {
      name: 'dismissLabel',
      type: 'string',
      defaultValue: "'Chiudi'",
      description: t.rich('componentDocs.banner.props.dismissLabel', { code: codeTag }),
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: t.rich('componentDocs.banner.props.children', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('actionsAndSurfaces')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Banner</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.banner.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('variants')}</h2>
      <Example code={VARIANTS_SNIPPET}>
        <div className="flex flex-col gap-3 w-full max-w-md">
          <Banner variant="info" title="Heads up">
            Your trial ends in 7 days. Upgrade to keep your projects.
          </Banner>
          <Banner variant="success" title="Saved">
            Settings have been updated.
          </Banner>
          <Banner variant="warning" title="Quota at 90%">
            You&rsquo;ll hit the storage cap by Friday.
          </Banner>
          <Banner variant="danger" title="Action required">
            Payment failed — update your card.
          </Banner>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('dismissible')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.banner.body.dismissible', { code: codeTag })}
      </p>
      <Code code={DISMISSIBLE_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('noIcon')}</h2>
      <p className="text-foreground/80 mb-3">{t('componentDocs.banner.body.noIcon')}</p>
      <Example code={NO_ICON_SNIPPET}>
        <div className="w-full max-w-md">
          <Banner variant="success" icon={false} title="Saved">
            Use icon={`{false}`} to drop the leading icon entirely.
          </Banner>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Banner props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.banner.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.banner.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.banner.a11y.2', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.banner.a11y.3', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/drawer" className="text-primary underline">
          ← Drawer
        </Link>
        <Link href="/docs/components/input" className="text-primary underline">
          Input →
        </Link>
      </div>
    </article>
  )
}
