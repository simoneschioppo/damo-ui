import type { ReactNode } from 'react'

export interface PatternDef {
  readonly name: string
  readonly background: string
  readonly backgroundSize?: string
  readonly backgroundColor?: string
  readonly children?: ReactNode
}

export const PATTERNS: ReadonlyArray<PatternDef> = [
  {
    name: 'STRIPES 45°',
    background: 'repeating-linear-gradient(45deg, var(--gold-500) 0 6px, transparent 6px 14px)',
  },
  {
    name: 'STRIPES H',
    background: 'repeating-linear-gradient(0deg, var(--plum-900) 0 4px, transparent 4px 12px)',
  },
  {
    name: 'DOTS',
    background: 'radial-gradient(var(--ink) 2px, transparent 2px)',
    backgroundSize: '14px 14px',
  },
  {
    name: 'GRID',
    background:
      'linear-gradient(var(--ink) 1.5px, transparent 1.5px), linear-gradient(90deg, var(--ink) 1.5px, transparent 1.5px)',
    backgroundSize: '20px 20px',
  },
  {
    name: 'CHECKER',
    background:
      'linear-gradient(45deg, var(--paper-200) 25%, transparent 25%, transparent 75%, var(--paper-200) 75%), linear-gradient(45deg, var(--paper-200) 25%, transparent 25%, transparent 75%, var(--paper-200) 75%)',
    backgroundColor: '#fff',
    backgroundSize: '20px 20px',
  },
  {
    name: 'WEAVE',
    background:
      'linear-gradient(45deg, var(--gold-500) 25%, transparent 25%, transparent 75%, var(--gold-500) 75%), linear-gradient(45deg, var(--gold-500) 25%, transparent 25%, transparent 75%, var(--gold-500) 75%)',
    backgroundSize: '24px 24px',
    backgroundColor: 'var(--paper-50)',
  },
  {
    name: 'WAVES',
    background: 'var(--gold-500)',
    children: (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M0 50 Q 12.5 20 25 50 T 50 50 T 75 50 T 100 50"
          stroke="#000"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M0 70 Q 12.5 40 25 70 T 50 70 T 75 70 T 100 70"
          stroke="#fff"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M0 30 Q 12.5 0 25 30 T 50 30 T 75 30 T 100 30"
          stroke="var(--plum-900)"
          strokeWidth="3"
          fill="none"
        />
      </svg>
    ),
  },
  {
    name: 'SCATTER',
    background: 'var(--paper-100)',
    children: (
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <circle cx="20" cy="20" r="8" fill="var(--gold-500)" stroke="#000" strokeWidth="2" />
        <rect
          x="55"
          y="10"
          width="18"
          height="18"
          transform="rotate(45 64 19)"
          fill="var(--plum-500)"
          stroke="#000"
          strokeWidth="2"
        />
        <polygon points="80,70 95,95 65,95" fill="var(--plum-900)" />
        <path d="M10 60 Q 25 50 40 60 T 55 70" stroke="#000" strokeWidth="3" fill="none" />
        <circle cx="72" cy="55" r="4" fill="#000" />
        <path d="M15 85 l8 8 M23 85 l-8 8" stroke="var(--gold-500)" strokeWidth="3" />
      </svg>
    ),
  },
] as const
