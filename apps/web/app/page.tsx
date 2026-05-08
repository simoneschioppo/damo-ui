import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button, MemphisShape } from '@damo/ui'
import { BRAND } from '../lib/brand'
import { codeTag, monoTag, linkTag } from '../lib/i18n-tags'

const FEATURE_KEYS = ['components', 'tokens', 'themeGenerator'] as const

export default async function HomePage() {
  const t = await getTranslations('home')
  const brandT = await getTranslations('brand')

  return (
    <main className="px-6 sm:px-10 lg:px-16 py-16 max-w-[1200px] mx-auto">
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-12 items-center mb-20">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-4">
            {t('eyebrow')}
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] mb-6">
            {BRAND.libName} —
            <br />
            {t('headlineLine1')}
            <br />
            {t('headlineLine2')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-[60ch] mb-8">
            {brandT('tagline')} {t('leadSuffix')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="primary" size="lg">
              <Link href="/docs">{t('browseDocs')}</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/theme-generator">{t('openThemeGenerator')}</Link>
            </Button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                'repeating-linear-gradient(45deg, var(--primary) 0 6px, transparent 6px 14px)',
              opacity: 0.18,
              clipPath: 'polygon(0 18%, 100% 0, 96% 88%, 4% 100%)',
            }}
          />
          <img
            src={BRAND.mascotHeroSrc}
            alt={brandT('mascotHeroAlt')}
            width={320}
            height={Math.round(320 * (BRAND.mascotHeroHeight / BRAND.mascotHeroWidth))}
            className="relative"
            style={{
              transform: 'rotate(-4deg)',
              filter: 'drop-shadow(var(--shadow-memphis))',
            }}
          />
          <MemphisShape
            variant="diamond"
            size={72}
            color="var(--secondary)"
            className="absolute -top-4 -left-4"
          />
          <MemphisShape
            variant="star"
            size={52}
            color="var(--primary)"
            className="absolute -bottom-6 -right-6"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t-2 border-memphis pt-10">
        {FEATURE_KEYS.map((key) => (
          <div
            key={key}
            className="border-2 border-memphis bg-card shadow-memphis p-5 flex flex-col gap-2"
          >
            <div className="font-display text-xl tracking-wide">
              {t(`features.${key}.title`)}
            </div>
            <p className="text-sm text-muted-foreground">{t(`features.${key}.desc`)}</p>
          </div>
        ))}
      </section>

      <section className="mt-20 border-t-2 border-memphis pt-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
          {t('quickInstall.eyebrow')}
        </div>
        <h2 className="font-display text-3xl mb-4">{t('quickInstall.heading')}</h2>
        <ol className="space-y-2 text-foreground/85 list-decimal pl-5">
          <li>{t.rich('quickInstall.step1', { code: codeTag, mono: monoTag })}</li>
          <li>{t.rich('quickInstall.step2', { mono: monoTag })}</li>
          <li>
            {t.rich('quickInstall.step3', { link: linkTag('/docs/getting-started') })}
          </li>
        </ol>
      </section>
    </main>
  )
}
