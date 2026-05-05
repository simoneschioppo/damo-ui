import type { Config } from 'tailwindcss'

/**
 * Damo UI — legacy v3-style Tailwind preset.
 *
 * Tailwind v4 consumers should @import the lib's CSS instead (see
 * `@damo/ui/styles/theme.css`); v4 picks up tokens via `@theme inline { … }`
 * automatically and doesn't need this preset.
 *
 * This file remains as a compatibility shim for consumers still on
 * Tailwind v3, who can do:
 *
 *   import damo from '@damo/ui/tailwind.preset'
 *   export default { presets: [damo], … }
 *
 * The token surface here mirrors the v1 audit — every entry corresponds
 * to a token that the lib actually ships and that at least one component
 * consumes. Tokens that were dropped during the audit (rage, accent,
 * input, radius-lg, border-thin/base/thick, space-N, shadow-sm/lg,
 * ease-in-out, z-base, z-sticky) are intentionally absent so v3
 * consumers don't get utility classes that resolve to undefined.
 */
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // Surfaces
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        // Intent
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        // Status
        success: 'var(--success)',
        'success-foreground': 'var(--success-foreground)',
        warning: 'var(--warning)',
        'warning-foreground': 'var(--warning-foreground)',
        info: 'var(--info)',
        'info-foreground': 'var(--info-foreground)',
        // Chrome
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        ring: 'var(--ring)',
        // Memphis
        memphis: 'var(--memphis-border-color)',
        'memphis-shadow': 'var(--memphis-shadow-color)',
        // Badge
        'badge-featured': 'var(--badge-featured)',
        'badge-featured-foreground': 'var(--badge-featured-foreground)',
        // Charts
        'chart-1': 'var(--chart-1)',
        'chart-2': 'var(--chart-2)',
        'chart-3': 'var(--chart-3)',
        'chart-4': 'var(--chart-4)',
        'chart-5': 'var(--chart-5)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        selection: 'var(--radius-selection)',
        pill: 'var(--radius-pill)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        // Canonical Memphis stack
        'memphis-sm': 'var(--shadow-memphis-sm)',
        'memphis-card': 'var(--shadow-memphis-card)',
        memphis: 'var(--shadow-memphis)',
        'memphis-lg': 'var(--shadow-memphis-lg)',
        'memphis-hover': 'var(--shadow-memphis-hover)',
        'memphis-active': 'var(--shadow-memphis-active)',
        // Soft tier (single token — see tokens.css)
        md: 'var(--shadow-md)',
      },
      transitionDuration: {
        snap: 'var(--duration-snap)',
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        memphis: 'var(--ease-memphis)',
        out: 'var(--ease-out)',
      },
      zIndex: {
        header: 'var(--z-header)',
        dropdown: 'var(--z-dropdown)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
        tooltip: 'var(--z-tooltip)',
      },
    },
  },
}

export default preset
