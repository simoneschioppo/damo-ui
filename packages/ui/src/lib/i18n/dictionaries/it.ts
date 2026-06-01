import { it as itLocale } from 'date-fns/locale'
import type { Dictionary } from '../types'

export const it: Dictionary = {
  spinner: {
    label: 'Caricamento…',
  },
  combobox: {
    placeholder: 'Scegli…',
    searchPlaceholder: 'Cerca…',
    emptyMessage: 'Nessun risultato',
  },
  datePicker: {
    placeholder: 'Seleziona una data',
    dateFnsLocale: itLocale,
  },
  pagination: {
    label: 'Paginazione',
    previous: 'Precedente',
    next: 'Successivo',
    page: 'Pagina',
    pageOf: (page, total) => `Pagina ${page} di ${total}`,
  },
  breadcrumbs: {
    label: 'Percorso',
  },
  banner: {
    dismissLabel: 'Chiudi',
  },
  dialog: {
    closeLabel: 'Chiudi',
  },
  drawer: {
    closeLabel: 'Chiudi',
  },
  sidebar: {
    toggleLabel: 'Apri/chiudi navigazione',
    label: 'Navigazione',
  },
  appTopBar: {
    menuLabel: 'Apri menu',
  },
  toast: {
    closeLabel: 'Chiudi',
  },
}
