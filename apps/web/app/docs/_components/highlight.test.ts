import { describe, it, expect } from 'vitest'
import { highlightCode } from './highlight'

describe('highlightCode', () => {
  it('returns an HTML string wrapping the input in a <pre><code> structure', async () => {
    const html = await highlightCode('const x = 1\n', 'tsx')
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

  it('falls back to tsx tokenisation for unknown languages so the block still renders', async () => {
    const html = await highlightCode('plain text', 'unknown-lang-xyz')
    // Vitesse tokenises across the space, so the literal substring isn't
    // contiguous in the output. We still expect every source character to
    // survive the round-trip.
    expect(html).toContain('plain')
    expect(html).toContain('text')
    expect(html).toContain('<pre')
  })

  it('strips attribute-breaking characters from the data-lang to prevent injection', async () => {
    const html = await highlightCode('x', 'tsx" onmouseover="alert(1)')
    const langMatch = html.match(/<pre[^>]*data-lang="([^"]*)"/)
    expect(langMatch).not.toBeNull()
    const langValue = langMatch![1] ?? ''
    expect(langValue).not.toMatch(/[\s"'<>=]/)
  })

  // ── gh-100 dual-theme + line-numbers regression ───────────────────────

  it('emits dual-theme CSS variables (--shiki-light and --shiki-dark) on tokens', async () => {
    const html = await highlightCode(`const x = 1`, 'ts')
    expect(html).toMatch(/--shiki-light:/)
    expect(html).toMatch(/--shiki-dark:/)
  })

  it('does not inline a hardcoded color attribute (defaultColor: false)', async () => {
    // With `defaultColor: false`, Shiki should NOT add a plain `color: #xxx`
    // outside of CSS-var declarations — the chrome stylesheet picks one var
    // or the other based on `data-theme`.
    const html = await highlightCode(`const x = 1`, 'ts')
    expect(html).not.toMatch(/style="color:#[0-9a-f]{3,8}"/i)
  })

  it('uses both vitesse theme classes on the <pre>', async () => {
    const html = await highlightCode(`const x = 1`, 'ts')
    expect(html).toMatch(/class="[^"]*vitesse-light[^"]*"/)
    expect(html).toMatch(/class="[^"]*vitesse-dark[^"]*"/)
  })

  it('adds the has-line-numbers class when withLineNumbers is true', async () => {
    const code = `const a = 1\nconst b = 2\nconst c = 3`
    const html = await highlightCode(code, 'ts', { withLineNumbers: true })
    expect(html).toContain('has-line-numbers')
    const matches = html.match(/class="line-number"/g) ?? []
    expect(matches.length).toBe(3)
  })

  it('omits line numbers when withLineNumbers is false (default)', async () => {
    const html = await highlightCode(`const x = 1`, 'ts')
    expect(html).not.toContain('has-line-numbers')
    expect(html).not.toContain('class="line-number"')
  })
})
