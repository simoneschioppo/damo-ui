import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

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
