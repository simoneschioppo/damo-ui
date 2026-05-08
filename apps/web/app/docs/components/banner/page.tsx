import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Banner } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Banner } from '@damo/ui'`

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

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'variant',
    type: "'info' | 'success' | 'warning' | 'danger'",
    defaultValue: "'info'",
    description:
      'Sets the background tint, the Memphis shadow color, and the default leading icon. `danger` also switches the wrapper role to `alert` for screen readers.',
  },
  {
    name: 'title',
    type: 'ReactNode',
    description: 'Optional bold heading rendered before the body.',
  },
  {
    name: 'icon',
    type: 'ReactNode | false',
    description:
      'Override the variant default icon. Pass `false` to drop the icon entirely; pass any ReactNode to substitute a custom glyph.',
  },
  {
    name: 'dismissible',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'When true, renders an X button on the trailing edge that hides the banner from local state.',
  },
  {
    name: 'onDismiss',
    type: '() => void',
    description: 'Fires when the user clicks the dismiss button. Use it to persist the dismissal.',
  },
  {
    name: 'dismissLabel',
    type: 'string',
    defaultValue: "'Chiudi'",
    description: 'Aria label for the dismiss button.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Body content rendered below the title.',
  },
]

export const metadata = { title: `Banner — ${BRAND.libName}` }

export default async function BannerDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('actionsAndSurfaces')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Banner</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Inline notification surface. Four tone variants (info, success, warning, danger), an
        optional title, an optional dismiss button, and an icon slot that defaults to a tone-aware
        glyph but accepts any ReactNode.
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
        Pass <code className="font-mono">dismissible</code> to add a close affordance. The banner
        clears its local state on click; pair with <code className="font-mono">onDismiss</code> to
        persist the dismissal (e.g. save to localStorage so it doesn&rsquo;t come back).
      </p>
      <Code code={DISMISSIBLE_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('noIcon')}</h2>
      <p className="text-foreground/80 mb-3">
        Drop the leading icon when the banner is purely text-driven.
      </p>
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
        <li>
          The wrapper renders <code className="font-mono">role=&quot;status&quot;</code> for{' '}
          <code className="font-mono">info</code>, <code className="font-mono">success</code> and{' '}
          <code className="font-mono">warning</code>;{' '}
          <code className="font-mono">role=&quot;alert&quot;</code> for{' '}
          <code className="font-mono">danger</code>.
        </li>
        <li>
          Live-region note: <code className="font-mono">alert</code> and{' '}
          <code className="font-mono">status</code> only fire announcements when the banner is
          inserted into an already-mounted DOM. A banner present in the initial server render is
          read in document order, not as an interrupt — mount it dynamically (after a network
          response, after dismissing a modal, etc.) when you need the announcement.
        </li>
        <li>
          Icons are <code className="font-mono">aria-hidden</code> — the title and body carry the
          message.
        </li>
        <li>
          The dismiss button gets <code className="font-mono">aria-label</code> from{' '}
          <code className="font-mono">dismissLabel</code> (defaults to{' '}
          <code className="font-mono">&quot;Chiudi&quot;</code>).
        </li>
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
