import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, Button } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'

const IMPORT_SNIPPET = `import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from '@damo/ui'`

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

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'variant',
    type: "'default' | 'elevated' | 'featured' | 'interactive' | 'inverse'",
    defaultValue: "'default'",
    description: 'Visual treatment. Featured uses the gold accent; inverse flips fg/bg for dark surfaces.',
  },
  {
    name: 'padding',
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'md'",
    description: 'Inner spacing applied to the body and chrome rows.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes are merged on top of the variant defaults.',
  },
]

export const metadata = { title: 'Card — Axolab' }

export default function CardDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        COMPONENTS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Card</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Composable surface container. Five variants share the same Memphis chrome but differ in
        accent, weight, and elevation.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Composition</h2>
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
            <CardBody>The most prominent variant — solid border, hard shadow, gold accent.</CardBody>
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

      <h2 className="font-display text-2xl mb-3 mt-10">API</h2>
      <PropsTable props={PROPS} caption="Card props" />

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/button" className="text-primary underline">
          ← Button
        </Link>
        <Link href="/docs/components/dialog" className="text-primary underline">
          Dialog →
        </Link>
      </div>
    </article>
  )
}
