import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { BRAND } from '../lib/brand'

const ctaPrimaryClass =
  'inline-flex items-center justify-center px-5 py-2.5 font-semibold uppercase tracking-wide bg-primary text-primary-foreground border-2 border-memphis shadow-memphis no-underline hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform'

const ctaGhostClass =
  'inline-flex items-center justify-center px-5 py-2.5 font-semibold uppercase tracking-wide bg-card text-foreground border-2 border-memphis shadow-memphis no-underline hover:bg-muted transition-colors'

export default async function NotFound() {
  const t = await getTranslations('notFound')
  const brandT = await getTranslations('brand')
  return (
    <main className="px-6 py-20 max-w-[800px] mx-auto text-center flex flex-col items-center gap-6">
      <img
        src={BRAND.mascotSrc}
        alt={brandT('mascotAlt')}
        width={220}
        height={Math.round(220 * (BRAND.mascotHeight / BRAND.mascotWidth))}
        style={{ filter: 'drop-shadow(var(--shadow-memphis))' }}
      />
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
        {t('eyebrow')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95]">{t('heading')}</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch]">{t('body')}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className={ctaPrimaryClass}>
          {t('backHome')}
        </Link>
        <Link href="/docs" className={ctaGhostClass}>
          {t('openDocs')}
        </Link>
      </div>
    </main>
  )
}
