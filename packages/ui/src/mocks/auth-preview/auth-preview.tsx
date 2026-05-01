'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../../components/button'
import { Input } from '../../components/input'
import { Label } from '../../components/label'
import { Separator } from '../../components/separator'

export type AuthPreviewProps = HTMLAttributes<HTMLDivElement>

export const AuthPreview = forwardRef<HTMLDivElement, AuthPreviewProps>(function AuthPreview(
  { className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('w-full mx-auto flex flex-col gap-5', className)}
      style={{ maxWidth: 400 }}
      {...rest}
    >
      <header className="flex flex-col gap-1">
        <h2 className="font-display text-3xl leading-tight text-foreground m-0">Bentornato</h2>
        <p className="text-sm text-muted-foreground m-0">Accedi per continuare.</p>
      </header>

      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="auth-email">Email</Label>
          <Input id="auth-email" type="email" autoComplete="email" placeholder="nome@esempio.it" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="auth-password">Password</Label>
          <Input
            id="auth-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" variant="primary" fullWidth>
          Entra
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          o accedi con
        </span>
        <Separator className="flex-1" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="ghost" fullWidth>
          Google
        </Button>
        <Button variant="ghost" fullWidth>
          GitHub
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground m-0">
        <Button variant="link" type="button">
          Non hai un account? Registrati
        </Button>
      </p>
    </div>
  )
})
