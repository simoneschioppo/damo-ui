import type { Locale as DateFnsLocale } from 'date-fns'

export type Locale = 'en' | 'it'

export const DEFAULT_LOCALE: Locale = 'en'

export interface Dictionary {
  spinner: {
    label: string
  }
  combobox: {
    placeholder: string
    searchPlaceholder: string
    emptyMessage: string
  }
  datePicker: {
    placeholder: string
    dateFnsLocale: DateFnsLocale
  }
  pagination: {
    /** `aria-label` on the wrapping `<nav>`. */
    label: string
    previous: string
    next: string
    page: string
    pageOf: (page: number, total: number) => string
  }
  breadcrumbs: {
    /** `aria-label` on the wrapping `<nav>`. */
    label: string
  }
  banner: {
    dismissLabel: string
  }
  dialog: {
    closeLabel: string
  }
  drawer: {
    closeLabel: string
  }
  sidebar: {
    /** `aria-label` on the SidebarTrigger button. */
    toggleLabel: string
    /** Accessible (sr-only) name for the mobile nav drawer. */
    label: string
  }
  appTopBar: {
    /** `aria-label` on the mobile menu (hamburger) button. */
    menuLabel: string
  }
  toast: {
    closeLabel: string
  }
}
