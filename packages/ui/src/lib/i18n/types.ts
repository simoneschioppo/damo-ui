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
    previous: string
    next: string
    page: string
    pageOf: (page: number, total: number) => string
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
  toast: {
    closeLabel: string
  }
}
