import type { GlobalProvider } from '@ladle/react'
import '../src/styles/tokens.css'
import '../src/styles/themes.css'
import '../src/styles/globals.css'
import '../src/styles/patterns.css'

export const Provider: GlobalProvider = ({ children, globalState }) => {
  return (
    <div data-theme={globalState.theme} style={{ minHeight: '100vh', padding: 24 }}>
      {children}
    </div>
  )
}
