'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

export interface CopyButtonProps {
  readonly text: string
  readonly label?: string
}

const RESET_DELAY_MS = 1500

export function CopyButton({ text, label }: CopyButtonProps) {
  const t = useTranslations('docsChrome.copyButton')
  const resolvedLabel = label ?? t('label')
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  async function copy() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setCopied(false), RESET_DELAY_MS)
    } catch {
      // Permission denied or document not focused — surface no UI; user can re-try.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={resolvedLabel}
      className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.15em] border border-[#30363d] bg-transparent text-[#c9d1d9] hover:bg-[#21262d] hover:border-[#8b949e] transition-colors"
    >
      {copied ? t('copied') : t('default')}
    </button>
  )
}
