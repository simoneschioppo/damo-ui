import { enUS } from 'date-fns/locale'
import type { Dictionary } from '../types'

export const en: Dictionary = {
  spinner: {
    label: 'Loading…',
  },
  combobox: {
    placeholder: 'Choose…',
    searchPlaceholder: 'Search…',
    emptyMessage: 'No results',
  },
  datePicker: {
    placeholder: 'Pick a date',
    dateFnsLocale: enUS,
  },
  pagination: {
    label: 'Pagination',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    pageOf: (page, total) => `Page ${page} of ${total}`,
  },
  breadcrumbs: {
    label: 'Breadcrumb',
  },
  banner: {
    dismissLabel: 'Dismiss',
  },
  dialog: {
    closeLabel: 'Close',
  },
  drawer: {
    closeLabel: 'Close',
  },
  toast: {
    closeLabel: 'Close',
  },
}
