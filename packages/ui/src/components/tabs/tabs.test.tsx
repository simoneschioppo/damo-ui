import { afterEach, describe, it, expect, vi } from 'vitest'
import { useState } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

afterEach(() => {
  cleanup()
})

describe('Tabs', () => {
  it('renders a list with triggers', () => {
    const { getAllByRole } = render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A panel</TabsContent>
        <TabsContent value="b">B panel</TabsContent>
      </Tabs>,
    )
    const triggers = getAllByRole('tab')
    expect(triggers.length).toBe(2)
  })
})

describe('TabsList', () => {
  // Regression: TabsList used `border-b-base` but `base` is not in
  // Tailwind's `borderWidth` scale (the v1 audit removed
  // border-thin/base/thick tokens). The class never resolved, so the
  // bottom rule was missing — the active trigger's 3px primary bar had
  // nothing to overlap. The intended width is `border-b-2`, matching
  // the trigger's `-mb-[2px]` overlap math.
  it('applies the resolved border-b-2 class to the list', () => {
    const { getByRole } = render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>,
    )
    const list = getByRole('tablist')
    const classes = list.className.split(/\s+/)
    expect(classes).toContain('border-b-2')
    expect(classes).toContain('border-memphis')
    expect(classes).not.toContain('border-b-base')
  })
})

describe('TabsTrigger', () => {
  it('shows the active underline when its tab is selected', () => {
    const { getByRole } = render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
      </Tabs>,
    )
    const active = getByRole('tab', { name: 'A' })
    expect(active.className).toContain('data-[state=active]:border-b-[3px]')
    expect(active.className).toContain('data-[state=active]:border-primary')
  })
})

describe('Tabs — selection behavior', () => {
  function renderTwoTabs() {
    return render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A panel</TabsContent>
        <TabsContent value="b">B panel</TabsContent>
      </Tabs>,
    )
  }

  it('renders only the default tab panel on initial render', () => {
    renderTwoTabs()
    expect(screen.getByText('A panel')).toBeInTheDocument()
    expect(screen.queryByText('B panel')).toBeNull()
  })

  it('switches the active panel when the user clicks another trigger', async () => {
    const user = userEvent.setup()
    renderTwoTabs()
    await user.click(screen.getByRole('tab', { name: 'B' }))
    expect(screen.getByText('B panel')).toBeInTheDocument()
    expect(screen.queryByText('A panel')).toBeNull()
  })

  it('reflects data-state="active" / "inactive" after a click', async () => {
    const user = userEvent.setup()
    renderTwoTabs()
    const tabA = screen.getByRole('tab', { name: 'A' })
    const tabB = screen.getByRole('tab', { name: 'B' })
    expect(tabA.getAttribute('data-state')).toBe('active')
    expect(tabB.getAttribute('data-state')).toBe('inactive')
    await user.click(tabB)
    expect(tabA.getAttribute('data-state')).toBe('inactive')
    expect(tabB.getAttribute('data-state')).toBe('active')
  })

  it('invokes onValueChange with the new tab value', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="a" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
        <TabsContent value="b">B</TabsContent>
      </Tabs>,
    )
    await user.click(screen.getByRole('tab', { name: 'B' }))
    expect(onValueChange).toHaveBeenCalledWith('b')
  })

  it('supports controlled mode — value follows the parent state', async () => {
    function Controlled() {
      const [value, setValue] = useState('a')
      return (
        <>
          <button type="button" onClick={() => setValue('b')}>
            force B
          </button>
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="a">A</TabsTrigger>
              <TabsTrigger value="b">B</TabsTrigger>
            </TabsList>
            <TabsContent value="a">A panel</TabsContent>
            <TabsContent value="b">B panel</TabsContent>
          </Tabs>
        </>
      )
    }
    const user = userEvent.setup()
    render(<Controlled />)
    expect(screen.getByText('A panel')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'force B' }))
    expect(screen.getByText('B panel')).toBeInTheDocument()
  })
})
