'use client'

import { useState } from 'react'

export interface CopyButtonProps {
  readonly text: string
  readonly label?: string
}

const RESET_DELAY_MS = 1500

export function CopyButton({ text, label = 'Copy code' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), RESET_DELAY_MS)
    } catch {
      // Permission denied or document not focused — surface no UI; user can re-try.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className="absolute top-2 right-2 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.15em] border-2 border-memphis bg-card text-foreground hover:bg-muted shadow-[2px_2px_0_var(--memphis-border-color)] transition-shadow"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
