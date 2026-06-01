import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
  Button,
} from '@axologic/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag, kbdTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from '@axologic/ui'`

const BASIC_SNIPPET = `<Card variant="default">
  <CardHeader>
    <CardTitle>Card title</CardTitle>
    <CardDescription>Short caption that supports the title.</CardDescription>
  </CardHeader>
  <CardBody>
    Body content. Mix any inline content here.
  </CardBody>
  <CardFooter>
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </CardFooter>
</Card>`

const FEATURED_SNIPPET = `<Card variant="featured" padding="lg">
  <CardHeader>
    <CardTitle>Featured</CardTitle>
  </CardHeader>
  <CardBody>The most prominent variant — solid border, hard shadow, gold accent.</CardBody>
</Card>`

const INTERACTIVE_SNIPPET = `<Card variant="interactive" padding="md">
  <CardBody>Hover and focus states make this variant tap-target friendly.</CardBody>
</Card>`

const ELEVATED_SNIPPET = `<Card variant="elevated" padding="md">
  <CardHeader>
    <CardTitle>Elevated</CardTitle>
    <CardDescription>Soft drop shadow instead of the hard Memphis shadow.</CardDescription>
  </CardHeader>
  <CardBody>For surfaces that should recede slightly into the page.</CardBody>
</Card>`

const INVERSE_SNIPPET = `<Card variant="inverse" padding="md">
  <CardHeader>
    <CardTitle>Inverse</CardTitle>
  </CardHeader>
  <CardBody>fg/bg flipped — drop on a light page for instant contrast.</CardBody>
</Card>`

export const metadata = { title: `Card — ${BRAND.libName}` }

export default async function CardDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'variant',
      type: "'default' | 'elevated' | 'featured' | 'interactive' | 'inverse'",
      defaultValue: "'default'",
      description: t('componentDocs.card.props.variant'),
    },
    {
      name: 'padding',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: t('componentDocs.card.props.padding'),
    },
    {
      name: 'className',
      type: 'string',
      description: t('componentDocs.card.props.className'),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('actionsAndSurfaces')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Card</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.card.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('composition')}</h2>
      <Example code={BASIC_SNIPPET} previewClassName="px-6 py-10 flex justify-center">
        <div className="w-full max-w-md">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Card title</CardTitle>
              <CardDescription>Short caption that supports the title.</CardDescription>
            </CardHeader>
            <CardBody>Body content. Mix any inline content here.</CardBody>
            <CardFooter>
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary">Confirm</Button>
            </CardFooter>
          </Card>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Featured variant</h2>
      <Example code={FEATURED_SNIPPET} previewClassName="px-6 py-10 flex justify-center">
        <div className="w-full max-w-md">
          <Card variant="featured" padding="lg">
            <CardHeader>
              <CardTitle>Featured</CardTitle>
            </CardHeader>
            <CardBody>
              The most prominent variant — solid border, hard shadow, gold accent.
            </CardBody>
          </Card>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Interactive variant</h2>
      <Example code={INTERACTIVE_SNIPPET} previewClassName="px-6 py-10 flex justify-center">
        <div className="w-full max-w-md">
          <Card variant="interactive" padding="md">
            <CardBody>Hover and focus states make this variant tap-target friendly.</CardBody>
          </Card>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Elevated variant</h2>
      <p className="text-foreground/80 mb-3">{t('componentDocs.card.body.elevatedIntro')}</p>
      <Example code={ELEVATED_SNIPPET} previewClassName="px-6 py-10 flex justify-center">
        <div className="w-full max-w-md">
          <Card variant="elevated" padding="md">
            <CardHeader>
              <CardTitle>Elevated</CardTitle>
              <CardDescription>
                Soft drop shadow instead of the hard Memphis shadow.
              </CardDescription>
            </CardHeader>
            <CardBody>For surfaces that should recede slightly into the page.</CardBody>
          </Card>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Inverse variant</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.card.body.inverseIntro', { code: codeTag })}
      </p>
      <Example code={INVERSE_SNIPPET} previewClassName="px-6 py-10 flex justify-center">
        <div className="w-full max-w-md">
          <Card variant="inverse" padding="md">
            <CardHeader>
              <CardTitle>Inverse</CardTitle>
            </CardHeader>
            <CardBody>fg/bg flipped — drop on a light page for instant contrast.</CardBody>
          </Card>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('api')}</h2>
      <PropsTable props={PROPS} caption="Card props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.card.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.card.a11y.1', { code: codeTag, kbd: kbdTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/button" className="text-primary underline">
          ← Button &amp; IconButton
        </Link>
        <Link href="/docs/components/dialog" className="text-primary underline">
          Dialog →
        </Link>
      </div>
    </article>
  )
}
