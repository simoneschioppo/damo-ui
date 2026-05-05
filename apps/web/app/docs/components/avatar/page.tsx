import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarGroup } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from '@damo/ui'`

const BASIC_SNIPPET = `<Avatar>
  <AvatarImage src="/users/dm.jpg" alt="Damo" />
  <AvatarFallback>DM</AvatarFallback>
</Avatar>`

const SIZES_SNIPPET = `<Avatar size="sm"><AvatarFallback>S</AvatarFallback></Avatar>
<Avatar size="md"><AvatarFallback>M</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback>L</AvatarFallback></Avatar>
<Avatar size="xl"><AvatarFallback>XL</AvatarFallback></Avatar>`

const SHAPE_SNIPPET = `<Avatar shape="square"><AvatarFallback>SQ</AvatarFallback></Avatar>`

const GROUP_SNIPPET = `<AvatarGroup max={3}>
  <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>C</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>D</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>E</AvatarFallback></Avatar>
</AvatarGroup>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg' | 'xl'",
    defaultValue: "'md'",
    description: '8/10/14/20 pixel diameter respectively.',
  },
  {
    name: 'shape',
    type: "'circle' | 'square'",
    defaultValue: "'circle'",
    description: '`square` adds a 2px Memphis border and removes the rounding.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Compose with `AvatarImage` and `AvatarFallback`.',
  },
]

export const metadata = { title: `Avatar — ${BRAND.libName}` }

export default function AvatarDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        DATA DISPLAY
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Avatar</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        User avatar with image + initial fallback. Built on Radix Avatar — when the image fails to
        load (or while loading), the fallback is shown instead.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Image + fallback</h2>
      <Example code={BASIC_SNIPPET}>
        <Avatar>
          <AvatarFallback>DM</AvatarFallback>
        </Avatar>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Sizes</h2>
      <Example code={SIZES_SNIPPET}>
        <div className="flex items-end gap-3">
          <Avatar size="sm">
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
          <Avatar size="xl">
            <AvatarFallback>XL</AvatarFallback>
          </Avatar>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Square shape</h2>
      <Example code={SHAPE_SNIPPET}>
        <Avatar shape="square">
          <AvatarFallback>SQ</AvatarFallback>
        </Avatar>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">AvatarGroup with overflow</h2>
      <p className="text-foreground/80 mb-3">
        Stack multiple avatars; <code className="font-mono">max</code> caps the visible count and
        renders a <code className="font-mono">+N</code> bubble for the rest.
      </p>
      <Example code={GROUP_SNIPPET}>
        <AvatarGroup max={3}>
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>D</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>E</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Props</h2>
      <PropsTable props={PROPS} caption="Avatar props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Always pass <code className="font-mono">alt</code> on{' '}
          <code className="font-mono">AvatarImage</code> — for decorative avatars an empty string is
          acceptable; otherwise describe the user.
        </li>
        <li>
          The fallback is purely visual — the <code className="font-mono">alt</code> text on the
          image (when present) carries the accessible name.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/attr-toggle-group" className="text-primary underline">
          ← AttrToggleGroup
        </Link>
        <Link href="/docs/components/accordion" className="text-primary underline">
          Accordion →
        </Link>
      </div>
    </article>
  )
}
