export interface Section {
  readonly id: string
}

/**
 * Given the design-system section list and the ids currently intersecting the
 * viewport, pick the section the TOC should mark as active. Returns the first
 * section in declaration order that is currently visible. Falls back to
 * `current` when nothing matches so the TOC stays stable between observer
 * callbacks.
 */
export function computeActiveSection<T extends Section>(
  sections: ReadonlyArray<T>,
  current: string,
  visibleIds: ReadonlyArray<string>,
): string {
  if (visibleIds.length === 0) return current
  const visible = new Set(visibleIds)
  const firstVisible = sections.find((s) => visible.has(s.id))
  return firstVisible ? firstVisible.id : current
}
