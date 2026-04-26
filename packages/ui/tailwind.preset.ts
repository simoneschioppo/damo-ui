import type { Config } from 'tailwindcss'

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // Semantic (shadcn-style taxonomy)
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        memphis: 'var(--memphis-border-color)',
        'memphis-shadow': 'var(--memphis-shadow-color)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        // Status
        success: 'var(--success)',
        warning: 'var(--warning)',
        rage: 'var(--rage)',
        info: 'var(--info)',
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
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
        full: 'var(--radius-full)',
      },
      borderWidth: {
        thin: 'var(--border-thin)',
        base: 'var(--border-base)',
        thick: 'var(--border-thick)',
      },
      boxShadow: {
        // Canonical v4 names
        'memphis-sm': 'var(--shadow-memphis-sm)',
        memphis: 'var(--shadow-memphis)',
        'memphis-lg': 'var(--shadow-memphis-lg)',
        'memphis-hover': 'var(--shadow-memphis-hover)',
        'memphis-active': 'var(--shadow-memphis-active)',
        // Backward-compat aliases (deprecated, v3 consumers)
        'm-sm': 'var(--shadow-memphis-sm)',
        'm-lg': 'var(--shadow-memphis-lg)',
        'm-hover': 'var(--shadow-memphis-hover)',
        'm-active': 'var(--shadow-memphis-active)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
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
        'in-out': 'var(--ease-in-out)',
      },
      zIndex: {
        base: 'var(--z-base)',
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        header: 'var(--z-header)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
        tooltip: 'var(--z-tooltip)',
      },
    },
  },
}

export default preset
