import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Reusable formatter tags for `next-intl`'s `t.rich(...)`. The docs prose has
 * many short paragraphs that mix translatable text with literal `<code>`
 * snippets, links, and emphasis. Centralising the tag implementations keeps
 * the message catalogs short and ensures every `<code>` block carries the
 * Memphis chrome (mono font + bordered chip).
 *
 * Usage:
 *   t.rich('intro', { code: codeTag, strong: strongTag, link: linkTag('/foo') })
 */

export const codeTag = (chunks: ReactNode) => (
  <code className="font-mono bg-muted px-1.5 py-0.5 border border-memphis/40">{chunks}</code>
)

export const monoTag = (chunks: ReactNode) => <code className="font-mono">{chunks}</code>

export const strongTag = (chunks: ReactNode) => (
  <strong className="text-foreground">{chunks}</strong>
)

export const emTag = (chunks: ReactNode) => <em>{chunks}</em>

export const brTag = () => <br />

export const linkTag =
  (href: string, options?: { external?: boolean; className?: string }) =>
  (chunks: ReactNode) => {
    const className = options?.className ?? 'text-primary underline'
    if (options?.external) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={className}>
          {chunks}
        </a>
      )
    }
    return (
      <Link href={href} className={className}>
        {chunks}
      </Link>
    )
  }
