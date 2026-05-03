'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@damo/ui'
import {
  AuthPreview,
  DashboardPreview,
  FeedPreview,
  GalleryPreview,
  ProfilePreview,
} from '@damo/ui/mocks'

export type PreviewScene = 'gallery' | 'auth' | 'dashboard' | 'profile' | 'feed'
export type PreviewMode = 'light' | 'dark'

const SCENES: ReadonlyArray<{ value: PreviewScene; label: string }> = [
  { value: 'gallery', label: 'Gallery' },
  { value: 'auth', label: 'Auth' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'profile', label: 'Profile' },
  { value: 'feed', label: 'Feed' },
]

const dialogClass = [
  'max-w-[min(1280px,96vw)] w-full',
  'h-[min(900px,92vh)]',
  'p-0 gap-0 overflow-hidden',
].join(' ')

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '20px 24px',
  borderBottom: '2px solid var(--memphis-border-color)',
  background: 'var(--card)',
  flexWrap: 'wrap',
}

const bodyStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: 32,
  background: 'var(--background)',
  color: 'var(--foreground)',
}

interface PreviewModalProps {
  /** Initial scene shown when the modal opens. */
  initialScene: PreviewScene
}

/**
 * Full-screen preview Dialog for the theme generator.
 *
 * Lets the user inspect any preview scene at a much larger size than the
 * sidebar-constrained editor pane allows. The dialog body wraps the scene
 * in a `data-theme` container so users can flip between the configured
 * light and dark variants without affecting the rest of the editor UI.
 */
export function PreviewModal({ initialScene }: PreviewModalProps) {
  const [open, setOpen] = useState(false)
  const [scene, setScene] = useState<PreviewScene>(initialScene)
  const [mode, setMode] = useState<PreviewMode>('light')

  // Keep the modal scene in sync when the editor pane switches scenes while
  // the modal is open — otherwise the modal would silently lag behind.
  useEffect(() => {
    if (open) setScene(initialScene)
  }, [open, initialScene])

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setScene(initialScene)
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="Open full preview"
          data-testid="open-preview-modal"
        >
          Open full preview
        </Button>
      </DialogTrigger>

      <DialogContent className={dialogClass} data-testid="preview-modal-content">
        <DialogHeader style={{ ...headerStyle, gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 24 }}>
            <DialogTitle>Live preview</DialogTitle>
            <DialogDescription>
              Full-screen preview of the selected scene. Toggle the variant buttons to see the
              light and dark themes applied with your configured tokens.
            </DialogDescription>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              variant={mode === 'light' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setMode('light')}
              aria-pressed={mode === 'light'}
            >
              Light
            </Button>
            <Button
              variant={mode === 'dark' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setMode('dark')}
              aria-pressed={mode === 'dark'}
            >
              Dark
            </Button>
          </div>
        </DialogHeader>

        <div
          data-testid="preview-modal-body"
          data-theme={mode}
          style={bodyStyle}
        >
          <Tabs value={scene} onValueChange={(v) => setScene(v as PreviewScene)}>
            <TabsList>
              {SCENES.map((s) => (
                <TabsTrigger key={s.value} value={s.value}>
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="gallery">
              <GalleryPreview />
            </TabsContent>
            <TabsContent value="auth">
              <AuthPreview />
            </TabsContent>
            <TabsContent value="dashboard">
              <DashboardPreview />
            </TabsContent>
            <TabsContent value="profile">
              <ProfilePreview />
            </TabsContent>
            <TabsContent value="feed">
              <FeedPreview />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
