import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuShortcut,
} from './context-menu'

const targetStyle = {
  display: 'grid',
  placeItems: 'center',
  width: 320,
  height: 180,
  border: '2px dashed var(--border-strong)',
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  color: 'var(--ink-muted)',
  userSelect: 'none' as const,
}

export const Basic = () => (
  <ContextMenu>
    <ContextMenuTrigger asChild>
      <div style={targetStyle}>Right-click qui</div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuLabel>Azioni</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuItem>
        Copia <ContextMenuShortcut>⌘C</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem>
        Incolla <ContextMenuShortcut>⌘V</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem>Elimina</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
)
