import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { Code } from '../Code'

const messages = {
  docsChrome: {
    copyButton: { label: 'Copy code', default: 'Copy', copied: 'Copied' },
  },
}

function renderCode(node: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {node}
    </NextIntlClientProvider>,
  )
}

async function awaitCode(props: Parameters<typeof Code>[0]): Promise<React.ReactElement> {
  // `Code` is an async RSC; resolve it to a tree synchronous-render can mount.
  const node = await Code(props)
  return node
}

describe('<Code> editor chrome (gh-100)', () => {
  it('renders an editor-style header with the filename tab when title is provided', async () => {
    const node = await awaitCode({ code: `const x = 1`, lang: 'ts', title: 'app/page.tsx' })
    const { container } = renderCode(node)
    expect(container.querySelector('.damo-code__tab')).not.toBeNull()
    expect(screen.getByText('app/page.tsx')).toBeInTheDocument()
  })

  it('omits the filename tab when no title is provided', async () => {
    const node = await awaitCode({ code: `const x = 1`, lang: 'ts' })
    const { container } = renderCode(node)
    expect(container.querySelector('.damo-code__tab')).toBeNull()
  })

  it('does not render any MacOS traffic-light dots', async () => {
    const node = await awaitCode({ code: `const x = 1`, lang: 'ts', title: 'foo.ts' })
    const { container } = renderCode(node)
    const html = container.innerHTML
    // Old chrome: hardcoded #ff5f57 / #febc2e / #28c840.
    expect(html.toLowerCase()).not.toContain('#ff5f57')
    expect(html.toLowerCase()).not.toContain('#febc2e')
    expect(html.toLowerCase()).not.toContain('#28c840')
  })

  it('does not embed the legacy GitHub-dark hardcoded greys', async () => {
    const node = await awaitCode({ code: `const x = 1`, lang: 'ts', title: 'foo.ts' })
    const { container } = renderCode(node)
    const html = container.innerHTML.toLowerCase()
    expect(html).not.toContain('#0d1117')
    expect(html).not.toContain('#161b22')
  })

  it('renders the language badge', async () => {
    const node = await awaitCode({ code: `echo hi`, lang: 'bash', title: 'terminal' })
    renderCode(node)
    expect(screen.getByText('BASH')).toBeInTheDocument()
  })

  it('renders the Copy button by default', async () => {
    const node = await awaitCode({ code: `const x = 1`, lang: 'ts' })
    renderCode(node)
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument()
  })

  it('hides the Copy button when hideCopy is true', async () => {
    const node = await awaitCode({ code: `const x = 1`, lang: 'ts', hideCopy: true })
    renderCode(node)
    expect(screen.queryByRole('button', { name: 'Copy code' })).toBeNull()
  })

  it('emits line numbers for multi-line snippets', async () => {
    const code = `const a = 1\nconst b = 2\nconst c = 3`
    const node = await awaitCode({ code, lang: 'ts' })
    const { container } = renderCode(node)
    const numbers = container.querySelectorAll('.line-number')
    expect(numbers.length).toBe(3)
  })

  it('omits line numbers for single-line snippets', async () => {
    const node = await awaitCode({ code: `pnpm add damo-ui`, lang: 'bash' })
    const { container } = renderCode(node)
    expect(container.querySelectorAll('.line-number').length).toBe(0)
  })

  it('honors explicit withLineNumbers=false even on multi-line code', async () => {
    const code = `const a = 1\nconst b = 2`
    const node = await awaitCode({ code, lang: 'ts', withLineNumbers: false })
    const { container } = renderCode(node)
    expect(container.querySelectorAll('.line-number').length).toBe(0)
  })

  it('honors explicit withLineNumbers=true even on single-line code', async () => {
    const node = await awaitCode({ code: `pnpm add damo-ui`, lang: 'bash', withLineNumbers: true })
    const { container } = renderCode(node)
    expect(container.querySelectorAll('.line-number').length).toBe(1)
  })

  it('drops the outer Memphis frame when embedded is true', async () => {
    const node = await awaitCode({ code: `const x = 1`, lang: 'ts', embedded: true })
    const { container } = renderCode(node)
    const wrapper = container.querySelector('.damo-code')
    expect(wrapper?.classList.contains('damo-code--embedded')).toBe(true)
    expect(wrapper?.classList.contains('damo-code--framed')).toBe(false)
  })
})
