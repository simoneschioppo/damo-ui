import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { UserCard, Badge } from 'damo-ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { UserCard } from 'damo-ui'`

const BASIC_SNIPPET = `<UserCard name="Damo Membro" meta="DAMO@EXAMPLE.COM" />`

const TRAILING_SNIPPET = `<UserCard
  name="Damo Membro"
  meta="DAMO@EXAMPLE.COM"
  trailing={<Badge variant="featured">PRO</Badge>}
/>`

const CUSTOM_AVATAR_SNIPPET = `<UserCard
  name="Damo Membro"
  avatar={<img src="/u/dm.jpg" alt="" className="w-full h-full object-cover" />}
  meta="MEMBRO DAL 2026"
/>`

export const metadata = { title: `UserCard — ${BRAND.libName}` }

export default async function UserCardDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'name',
      type: 'string',
      required: true,
      description: t.rich('componentDocs.user-card.props.name', { code: codeTag }),
    },
    {
      name: 'avatar',
      type: 'ReactNode',
      description: t.rich('componentDocs.user-card.props.avatar', { code: codeTag }),
    },
    {
      name: 'meta',
      type: 'ReactNode',
      description: t.rich('componentDocs.user-card.props.meta', { code: codeTag }),
    },
    {
      name: 'trailing',
      type: 'ReactNode',
      description: t.rich('componentDocs.user-card.props.trailing', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('cardsAndDecoration')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">UserCard</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.user-card.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Basic</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-md">
          <UserCard name="Damo Membro" meta="DAMO@EXAMPLE.COM" />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Trailing slot</h2>
      <Example code={TRAILING_SNIPPET}>
        <div className="w-full max-w-md">
          <UserCard
            name="Damo Membro"
            meta="DAMO@EXAMPLE.COM"
            trailing={<Badge variant="featured">PRO</Badge>}
          />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Custom avatar</h2>
      <Code code={CUSTOM_AVATAR_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="UserCard props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          {t.rich('componentDocs.user-card.a11y.0', {
            code: codeTag,
            link1: linkTag('/docs/components/card'),
          })}
        </li>
        <li>{t.rich('componentDocs.user-card.a11y.1', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/color-picker" className="text-primary underline">
          ← ColorPicker
        </Link>
        <Link href="/docs/components/feature-card" className="text-primary underline">
          FeatureCard →
        </Link>
      </div>
    </article>
  )
}
