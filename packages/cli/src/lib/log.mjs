/** Minimal ANSI logger — no dependencies. Colours auto-disable when not a TTY. */
const on = process.stdout.isTTY && !process.env.NO_COLOR
const wrap = (code) => (s) => (on ? `\x1b[${code}m${s}\x1b[0m` : String(s))

export const c = {
  bold: wrap('1'),
  dim: wrap('2'),
  red: wrap('31'),
  green: wrap('32'),
  yellow: wrap('33'),
  cyan: wrap('36'),
}

export const log = {
  info: (msg) => console.log(msg),
  step: (msg) => console.log(`${c.cyan('›')} ${msg}`),
  success: (msg) => console.log(`${c.green('✓')} ${msg}`),
  warn: (msg) => console.warn(`${c.yellow('!')} ${msg}`),
  error: (msg) => console.error(`${c.red('✗')} ${msg}`),
}
