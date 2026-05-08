import Link from 'next/link'
import { Children, isValidElement, type ReactNode } from 'react'

/**
 * Reusable formatter tags for `next-intl`'s `t.rich(...)`. The docs prose has
 * many short paragraphs that mix translatable text with literal `<code>`
 * snippets, links, and emphasis. Centralising the tag implementations keeps
 * the message catalogs short and ensures every `<code>` block carries the
 * Memphis chrome (mono font + bordered chip).
 *
 * Why we decode HTML entities here:
 *   `next-intl` parses `<tag>...</tag>` patterns inside message strings to
 *   route content into formatters. If a message contains literal angle
 *   brackets that look like unknown tags (e.g. `<input>`, `<button>`, or
 *   `<AttrToggleGroup attribute="data-theme">`) the parser bails and falls
 *   back to rendering the raw key. To stay safe, the catalogs encode any
 *   non-tag angle brackets as `&lt;` / `&gt;` and we decode them here so the
 *   rendered code chunk shows the user the real characters.
 *
 * Usage:
 *   t.rich('intro', { code: codeTag, strong: strongTag, link: linkTag('/foo') })
 */

const ENTITY_RE = /&(lt|gt|amp|quot|apos);/g
const ENTITIES: Record<string, string> = {
  lt: '<',
  gt: '>',
  amp: '&',
  quot: '"',
  apos: "'",
}

function decodeEntitiesInString(s: string): string {
  return s.replace(ENTITY_RE, (_, name) => ENTITIES[name] ?? '')
}

function decodeEntities(node: ReactNode): ReactNode {
  if (typeof node === 'string') return decodeEntitiesInString(node)
  if (Array.isArray(node)) return node.map(decodeEntities)
  // For React elements, leave untouched — entities only appear in raw text
  // chunks coming straight from the catalog.
  if (isValidElement(node)) return node
  return Children.map(node, (c) => (typeof c === 'string' ? decodeEntitiesInString(c) : c))
}

export const codeTag = (chunks: ReactNode) => (
  <code className="font-mono bg-muted px-1.5 py-0.5 border border-memphis/40">
    {decodeEntities(chunks)}
  </code>
)

export const monoTag = (chunks: ReactNode) => (
  <code className="font-mono">{decodeEntities(chunks)}</code>
)

export const strongTag = (chunks: ReactNode) => (
  <strong className="text-foreground">{decodeEntities(chunks)}</strong>
)

export const emTag = (chunks: ReactNode) => <em>{decodeEntities(chunks)}</em>

export const kbdTag = (chunks: ReactNode) => <kbd>{decodeEntities(chunks)}</kbd>

export const brTag = () => <br />

export const linkTag =
  (href: string, options?: { external?: boolean; className?: string }) =>
  (chunks: ReactNode) => {
    const className = options?.className ?? 'text-primary underline'
    const decoded = decodeEntities(chunks)
    if (options?.external) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={className}>
          {decoded}
        </a>
      )
    }
    return (
      <Link href={href} className={className}>
        {decoded}
      </Link>
    )
  }
