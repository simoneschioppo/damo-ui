import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button, IconButton, ArrowRightIcon, BoltIcon, CogIcon } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Button, IconButton } from '@damo/ui'`

const BASIC_SNIPPET = `<Button variant="primary">Save</Button>
<Button variant="ghost">Cancel</Button>`

const SIZES_SNIPPET = `<Button variant="primary" size="sm">Small</Button>
<Button variant="primary" size="md">Medium</Button>
<Button variant="primary" size="lg">Large</Button>`

const DISABLED_SNIPPET = `<Button variant="primary" disabled>
  Save
</Button>`

const FULL_WIDTH_SNIPPET = `<Button variant="primary" fullWidth>
  Continue
</Button>`

const AS_LINK_SNIPPET = `import Link from 'next/link'
import { Button } from '@damo/ui'

// Render the Link as a Button. All variant, size, and animation
// classes — including the Memphis press effect on :active — are
// merged onto the underlying <a>.
<Button asChild variant="primary" size="lg">
  <Link href="/docs">Browse docs</Link>
</Button>`

const ICON_INLINE_SNIPPET = `<Button variant="ghost">
  <ArrowRightIcon size={14} /> Continue
</Button>`

const ICON_BUTTON_SNIPPET = `<IconButton aria-label="Settings" variant="ghost">
  <CogIcon size={18} />
</IconButton>`

const ICON_BUTTON_VARIANTS_SNIPPET = `<IconButton aria-label="Continue" variant="primary">
  <ArrowRightIcon size={18} />
</IconButton>
<IconButton aria-label="Quick action" variant="outline">
  <BoltIcon size={18} />
</IconButton>
<IconButton aria-label="Settings" variant="ghost">
  <CogIcon size={18} />
</IconButton>`

export const metadata = {
  title: `Button & IconButton — ${BRAND.libName}`,
  description: 'Memphis-styled button + icon-only variant.',
}

export default async function ButtonDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link'",
      defaultValue: "'primary'",
      description: t.rich('componentDocs.button.props.variant', { code: codeTag }),
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg' | 'icon'",
      defaultValue: "'md'",
      description: t.rich('componentDocs.button.props.size', { code: codeTag }),
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: t.rich('componentDocs.button.props.disabled', { code: codeTag }),
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      defaultValue: 'false',
      description: t.rich('componentDocs.button.props.fullWidth', { code: codeTag }),
    },
    {
      name: 'asChild',
      type: 'boolean',
      defaultValue: 'false',
      description: t.rich('componentDocs.button.props.asChild', { code: codeTag }),
    },
    {
      name: 'className',
      type: 'string',
      description: t.rich('componentDocs.button.props.className', { code: codeTag }),
    },
  ]

  const ICON_BUTTON_PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'aria-label',
      type: 'string',
      required: true,
      description: t.rich('componentDocs.button.iconButtonProps.ariaLabel', { code: codeTag }),
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: t.rich('componentDocs.button.iconButtonProps.children', { code: codeTag }),
    },
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link'",
      defaultValue: "'primary'",
      description: t.rich('componentDocs.button.iconButtonProps.variant', { code: codeTag }),
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: t.rich('componentDocs.button.iconButtonProps.disabled', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('actionsAndSurfaces')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Button</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.button.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('usage')}</h2>
      <Example code={BASIC_SNIPPET}>
        <Button variant="primary">Save</Button>
        <Button variant="ghost">Cancel</Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('sizes')}</h2>
      <Example code={SIZES_SNIPPET}>
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary" size="md">
          Medium
        </Button>
        <Button variant="primary" size="lg">
          Large
        </Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('withInlineIcons')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.button.body.withInlineIcons', { code: codeTag })}
      </p>
      <Example code={ICON_INLINE_SNIPPET}>
        <Button variant="ghost">
          <ArrowRightIcon size={14} /> Continue
        </Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('disabled')}</h2>
      <Example code={DISABLED_SNIPPET}>
        <Button variant="primary" disabled>
          Save
        </Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('fullWidth')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.button.body.fullWidth', { code: codeTag })}
      </p>
      <Example code={FULL_WIDTH_SNIPPET} previewClassName="px-6 py-10">
        <div className="w-full">
          <Button variant="primary" fullWidth>
            Continue
          </Button>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('useAsLink')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.button.body.useAsLink', { code: codeTag })}
      </p>
      <Example code={AS_LINK_SNIPPET}>
        <Button asChild variant="primary" size="lg">
          <Link href="/docs">Browse docs</Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/theme-generator">Open theme generator</Link>
        </Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Button API</h2>
      <PropsTable props={PROPS} caption="Button props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.button.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.button.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.button.a11y.2', { code: codeTag })}</li>
      </ul>

      {/* ────────────────────────────────────────────────────────────
           IconButton (same family — documented on this page)
           ──────────────────────────────────────────────────────── */}
      <hr className="my-16 border-t-2 border-memphis" />

      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('sameFamily')}
      </div>
      <h2 className="font-display text-4xl leading-[0.95] mb-4">IconButton</h2>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-8">
        {t.rich('componentDocs.button.body.iconButtonLead', { code: codeTag })}
      </p>

      <h3 className="font-display text-xl mb-3">{tSec('basicUsage')}</h3>
      <Example code={ICON_BUTTON_SNIPPET}>
        <IconButton aria-label="Settings" variant="ghost">
          <CogIcon size={18} />
        </IconButton>
      </Example>

      <h3 className="font-display text-xl mb-3 mt-10">{tSec('variants')}</h3>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.button.body.iconButtonVariants', { code: codeTag })}
      </p>
      <Example code={ICON_BUTTON_VARIANTS_SNIPPET}>
        <IconButton aria-label="Continue" variant="primary">
          <ArrowRightIcon size={18} />
        </IconButton>
        <IconButton aria-label="Quick action" variant="outline">
          <BoltIcon size={18} />
        </IconButton>
        <IconButton aria-label="Settings" variant="ghost">
          <CogIcon size={18} />
        </IconButton>
      </Example>

      <h3 className="font-display text-xl mb-3 mt-10">IconButton API</h3>
      <PropsTable props={ICON_BUTTON_PROPS} caption="IconButton props" />

      <h3 className="font-display text-xl mb-3 mt-10">{tSec('accessibility')}</h3>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.button.iconButtonA11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.button.iconButtonA11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.button.iconButtonA11y.2', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/form-field" className="text-primary underline">
          ← FormField
        </Link>
        <Link href="/docs/components/card" className="text-primary underline">
          Card →
        </Link>
      </div>
    </article>
  )
}
