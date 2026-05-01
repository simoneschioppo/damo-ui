import { describe, it, expect } from 'vitest'
import { highlightCode } from './highlight'

describe('highlightCode', () => {
  it('returns an HTML string wrapping the input in a <pre><code> structure', async () => {
    const html = await highlightCode("const x = 1\n", 'tsx')
    expect(html).toContain('<pre')
    expect(html).toContain('<code')
    expect(html).toContain('</pre>')
  })

  it('annotates the language so callers can theme blocks per language', async () => {
    const html = await highlightCode('echo hello\n', 'bash')
    expect(html).toMatch(/data-lang="bash"|class="[^"]*language-bash[^"]*"/)
  })

  it('emits styled token spans for known TSX syntax', async () => {
    const html = await highlightCode("const x = 'a'\n", 'tsx')
    expect(html).toMatch(/<span[^>]*style="[^"]+">/)
  })

  it('escapes raw angle brackets inside source so output stays valid HTML', async () => {
    const html = await highlightCode('<Button />', 'tsx')
    expect(html).not.toMatch(/>\s*<Button \/>/)
    expect(html).toMatch(/&lt;|&#x3C;/i)
  })

  it('handles unknown languages by falling back to plaintext', async () => {
    const html = await highlightCode('plain text', 'unknown-lang-xyz')
    expect(html).toContain('plain text')
    expect(html).toContain('<pre')
  })
})
