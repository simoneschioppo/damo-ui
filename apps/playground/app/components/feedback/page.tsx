'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Container,
  Box,
  Button,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  Progress,
  Spinner,
  Skeleton,
  Badge,
  Chip,
  InfoIcon,
} from '@damacchi/ui'

const sectionStyle = {
  marginBottom: 40,
  paddingBottom: 28,
  borderBottom: '1px solid var(--border)',
}
const h2Style = {
  fontFamily: 'var(--font-display)',
  fontSize: 28,
  margin: '0 0 12px',
} as const

function AnimatedProgress() {
  const [v, setV] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setV((x) => (x >= 100 ? 0 : x + 10)), 800)
    return () => clearInterval(id)
  }, [])
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginBottom: 4 }}>{v}%</div>
      <Progress value={v} />
    </div>
  )
}

export default function FeedbackPage() {
  const [toastOpen, setToastOpen] = useState(false)
  const [toastV, setToastV] = useState<'default' | 'success' | 'warning' | 'danger'>('default')

  function openToast(v: 'default' | 'success' | 'warning' | 'danger') {
    setToastV(v)
    setToastOpen(false)
    setTimeout(() => setToastOpen(true), 10)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <ToastProvider>
        <Container size="xl">
          <div style={{ padding: '32px 0 64px' }}>
            <h1 className="display" style={{ fontSize: 56, margin: '0 0 8px' }}>
              Feedback
            </h1>
            <p style={{ color: 'var(--ink-muted)', marginBottom: 32 }}>
              7 componenti Tier 2: Tooltip, Toast, Progress, Spinner, Skeleton, Badge, Chip.
            </p>

            {/* Tooltip */}
            <section style={sectionStyle}>
              <h2 style={h2Style}>Tooltip</h2>
              <Box direction="row" gap={3}>
                {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                  <Tooltip key={side}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {side}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side={side}>Side: {side}</TooltipContent>
                  </Tooltip>
                ))}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button aria-label="Info" style={{ cursor: 'help' }}>
                      <InfoIcon size={20} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Icona info</TooltipContent>
                </Tooltip>
              </Box>
            </section>

            {/* Toast */}
            <section style={sectionStyle}>
              <h2 style={h2Style}>Toast</h2>
              <Box direction="row" gap={3} wrap="wrap">
                {(['default', 'success', 'warning', 'danger'] as const).map((v) => (
                  <Button key={v} variant="ghost" size="sm" onClick={() => openToast(v)}>
                    Toast {v}
                  </Button>
                ))}
              </Box>
              <Toast variant={toastV} open={toastOpen} onOpenChange={setToastOpen}>
                <div style={{ flex: 1 }}>
                  <ToastTitle>Toast {toastV}</ToastTitle>
                  <ToastDescription>Questo è un toast di tipo {toastV}.</ToastDescription>
                </div>
                <ToastAction altText="Azione">Azione</ToastAction>
                <ToastClose />
              </Toast>
              <ToastViewport />
            </section>

            {/* Progress */}
            <section style={sectionStyle}>
              <h2 style={h2Style}>Progress</h2>
              <Box direction="column" gap={4} style={{ maxWidth: 420 }}>
                {[25, 50, 75, 100].map((v) => (
                  <div key={v}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        marginBottom: 4,
                      }}
                    >
                      {v}%
                    </div>
                    <Progress value={v} />
                  </div>
                ))}
                <AnimatedProgress />
              </Box>
            </section>

            {/* Spinner */}
            <section style={sectionStyle}>
              <h2 style={h2Style}>Spinner</h2>
              <Box direction="row" gap={4} align="center">
                {[16, 24, 32, 48, 64].map((s) => (
                  <Spinner key={s} size={s} />
                ))}
                <Spinner size={32} style={{ color: 'var(--plum-500)' }} />
                <Spinner size={32} style={{ color: 'var(--danger)' }} />
                <Spinner size={32} style={{ color: 'var(--success)' }} />
              </Box>
            </section>

            {/* Skeleton */}
            <section style={sectionStyle}>
              <h2 style={h2Style}>Skeleton</h2>
              <Box direction="row" gap={5} wrap="wrap">
                <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Skeleton style={{ height: 160, width: '100%' }} />
                  <Skeleton style={{ height: 20, width: '60%' }} />
                  <Skeleton style={{ height: 16, width: '80%' }} />
                </div>
                <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <Skeleton
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: 'var(--radius-full)',
                        }}
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <Skeleton style={{ height: 14, width: '70%' }} />
                        <Skeleton style={{ height: 12, width: '50%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Box>
            </section>

            {/* Badge */}
            <section style={sectionStyle}>
              <h2 style={h2Style}>Badge</h2>
              <Box direction="row" gap={4} align="center">
                <span>Messaggi</span>
                <Badge>12</Badge>
                <span>Nuovo</span>
                <Badge variant="featured">HOT</Badge>
              </Box>
            </section>

            {/* Chip */}
            <section style={sectionStyle}>
              <h2 style={h2Style}>Chip (6 variants)</h2>
              <Box direction="row" gap={2} wrap="wrap">
                <Chip>Default</Chip>
                <Chip variant="accent">Accent</Chip>
                <Chip variant="brand">Brand</Chip>
                <Chip variant="success">Win</Chip>
                <Chip variant="danger">Loss</Chip>
                <Chip variant="warning">Draw</Chip>
              </Box>
              <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                <Chip size="sm">sm</Chip>
                <Chip>md</Chip>
                <Chip size="lg">lg</Chip>
              </div>
            </section>

            <p style={{ marginTop: 32 }}>
              <Link href="/" style={{ fontWeight: 600, color: 'var(--accent)' }}>
                ← Home
              </Link>
            </p>
          </div>
        </Container>
      </ToastProvider>
    </TooltipProvider>
  )
}
