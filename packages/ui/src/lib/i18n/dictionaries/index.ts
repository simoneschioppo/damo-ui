import type { Dictionary, Locale } from '../types'
import { en } from './en'
import { it } from './it'

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  it,
}

export { en, it }
