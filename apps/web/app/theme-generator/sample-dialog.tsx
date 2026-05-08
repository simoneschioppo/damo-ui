'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@damo/ui'

/**
 * Sample dialog mounted in the theme generator preview pane.
 *
 * Renders a regular-sized {@link Dialog} populated with the surface,
 * border, shadow, typography, intent, and badge tokens so the user can
 * see how the dialog component reacts to live theme edits without
 * having to wire up a separate scene.
 */
export function SampleDialog() {
  const t = useTranslations('sampleDialog')
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="open-sample-dialog">
          {t('openButton')}
        </Button>
      </DialogTrigger>

      <DialogContent data-testid="sample-dialog-content">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="featured">PRO</Badge>
            <Badge variant="success">v1.4.2</Badge>
            <Badge variant="default">Stable</Badge>
          </div>
          <Label htmlFor="sample-dialog-version">{t('versionLabel')}</Label>
          <Input id="sample-dialog-version" defaultValue="v1.4.3-beta" />
          <p className="text-sm text-muted-foreground m-0">{t('helperText')}</p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            data-testid="sample-dialog-cancel"
          >
            {t('cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={() => setOpen(false)}
            data-testid="sample-dialog-confirm"
          >
            {t('publish')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
