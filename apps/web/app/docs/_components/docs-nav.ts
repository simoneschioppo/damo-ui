export type DocsNavGroupKey =
  | 'gettingStarted'
  | 'foundations'
  | 'primitives'
  | 'actionsAndSurfaces'
  | 'forms'
  | 'feedback'
  | 'navigation'
  | 'attributeBoundPrimitives'
  | 'dataDisplay'
  | 'layout'
  | 'cardsAndDecoration'

export interface DocsNavEntry {
  readonly slug: string
  readonly label: string
  /** Optional i18n key under `docsSidebar.entries.{key}` for the label. */
  readonly labelKey?: string
  readonly status?: 'beta' | 'stub'
}

export interface DocsNavGroup {
  /** i18n key under `docsSidebar.groups.{key}` for the group title. */
  readonly key: DocsNavGroupKey
  /** English fallback title — used when no translation is mounted. */
  readonly title: string
  readonly entries: ReadonlyArray<DocsNavEntry>
}

export const DOCS_NAV: ReadonlyArray<DocsNavGroup> = [
  {
    key: 'gettingStarted',
    title: 'Getting Started',
    entries: [
      { slug: '/docs/getting-started', label: 'Introduction', labelKey: 'introduction' },
      { slug: '/docs/cli', label: 'CLI (copy-paste)' },
    ],
  },
  {
    key: 'foundations',
    title: 'Foundations',
    entries: [
      { slug: '/docs/foundations/tokens', label: 'Tokens' },
      { slug: '/docs/foundations/theming', label: 'Theming' },
      { slug: '/docs/foundations/colors', label: 'Colors' },
      { slug: '/docs/foundations/typography', label: 'Typography' },
      { slug: '/docs/foundations/patterns', label: 'Patterns' },
    ],
  },
  {
    key: 'primitives',
    title: 'Primitives',
    entries: [
      { slug: '/docs/components/box', label: 'Box' },
      { slug: '/docs/components/container', label: 'Container' },
      { slug: '/docs/components/aspect-ratio', label: 'AspectRatio' },
      { slug: '/docs/components/scroll-area', label: 'ScrollArea' },
      { slug: '/docs/components/separator', label: 'Separator' },
      { slug: '/docs/components/ornament', label: 'Ornament' },
      { slug: '/docs/components/form-field', label: 'FormField' },
    ],
  },
  {
    key: 'actionsAndSurfaces',
    title: 'Actions & Surfaces',
    entries: [
      { slug: '/docs/components/button', label: 'Button & IconButton' },
      { slug: '/docs/components/card', label: 'Card' },
      { slug: '/docs/components/dialog', label: 'Dialog' },
      { slug: '/docs/components/drawer', label: 'Drawer' },
      { slug: '/docs/components/banner', label: 'Banner' },
    ],
  },
  {
    key: 'forms',
    title: 'Forms',
    entries: [
      { slug: '/docs/components/input', label: 'Input' },
      { slug: '/docs/components/textarea', label: 'Textarea' },
      { slug: '/docs/components/label', label: 'Label' },
      { slug: '/docs/components/checkbox', label: 'Checkbox' },
      { slug: '/docs/components/radio-group', label: 'RadioGroup' },
      { slug: '/docs/components/switch', label: 'Switch' },
      { slug: '/docs/components/slider', label: 'Slider' },
      { slug: '/docs/components/segmented-control', label: 'SegmentedControl' },
      { slug: '/docs/components/select', label: 'Select' },
      { slug: '/docs/components/date-picker', label: 'DatePicker' },
      { slug: '/docs/components/combobox', label: 'Combobox' },
      { slug: '/docs/components/popover', label: 'Popover' },
    ],
  },
  {
    key: 'feedback',
    title: 'Feedback',
    entries: [
      { slug: '/docs/components/tooltip', label: 'Tooltip' },
      { slug: '/docs/components/toast', label: 'Toast' },
      { slug: '/docs/components/progress', label: 'Progress' },
      { slug: '/docs/components/spinner', label: 'Spinner' },
      { slug: '/docs/components/skeleton', label: 'Skeleton' },
      { slug: '/docs/components/badge', label: 'Badge' },
      { slug: '/docs/components/chip', label: 'Chip' },
      { slug: '/docs/components/hint', label: 'Hint' },
    ],
  },
  {
    key: 'navigation',
    title: 'Navigation',
    entries: [
      { slug: '/docs/components/tabs', label: 'Tabs' },
      { slug: '/docs/components/dropdown-menu', label: 'DropdownMenu' },
      { slug: '/docs/components/context-menu', label: 'ContextMenu' },
      { slug: '/docs/components/nav-item', label: 'NavItem' },
      { slug: '/docs/components/breadcrumbs', label: 'Breadcrumbs' },
      { slug: '/docs/components/pagination', label: 'Pagination' },
    ],
  },
  {
    key: 'attributeBoundPrimitives',
    title: 'Attribute-bound primitives',
    entries: [{ slug: '/docs/components/attr-toggle-group', label: 'AttrToggleGroup' }],
  },
  {
    key: 'dataDisplay',
    title: 'Data display',
    entries: [
      { slug: '/docs/components/avatar', label: 'Avatar' },
      { slug: '/docs/components/accordion', label: 'Accordion' },
      { slug: '/docs/components/table', label: 'Table' },
      { slug: '/docs/components/stat', label: 'Stat' },
      { slug: '/docs/components/medal', label: 'Medal' },
    ],
  },
  {
    key: 'layout',
    title: 'Layout',
    entries: [
      { slug: '/docs/components/app-shell', label: 'AppShell' },
      { slug: '/docs/components/app-top-bar', label: 'AppTopBar' },
      { slug: '/docs/components/page-header', label: 'PageHeader' },
      { slug: '/docs/components/sidebar', label: 'Sidebar' },
    ],
  },
  {
    key: 'cardsAndDecoration',
    title: 'Cards & Decoration',
    entries: [
      { slug: '/docs/components/color-picker', label: 'ColorPicker' },
      { slug: '/docs/components/user-card', label: 'UserCard' },
      { slug: '/docs/components/feature-card', label: 'FeatureCard' },
      { slug: '/docs/components/article-card', label: 'ArticleCard' },
      { slug: '/docs/components/memphis-shape', label: 'MemphisShape' },
    ],
  },
]
