import { FormField } from './form-field'

const inputStyle = {
  padding: '8px 10px',
  border: '1.5px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--surface)',
  color: 'var(--ink)',
  fontSize: 14,
}

export const Basic = () => (
  <div style={{ width: 320 }}>
    <FormField label="Email">
      <input type="email" placeholder="you@example.com" style={inputStyle} />
    </FormField>
  </div>
)

export const WithDescription = () => (
  <div style={{ width: 320 }}>
    <FormField label="Username" description="Visibile pubblicamente nel profilo">
      <input type="text" placeholder="mario_rossi" style={inputStyle} />
    </FormField>
  </div>
)

export const WithError = () => (
  <div style={{ width: 320 }}>
    <FormField label="Password" error="Almeno 8 caratteri">
      <input type="password" value="abc" readOnly style={inputStyle} />
    </FormField>
  </div>
)

export const WithDescriptionAndError = () => (
  <div style={{ width: 320 }}>
    <FormField label="Email" description="Non verrà condivisa" error="Formato non valido">
      <input type="email" value="not-an-email" readOnly style={inputStyle} />
    </FormField>
  </div>
)

export const WithTextarea = () => (
  <div style={{ width: 320 }}>
    <FormField label="Bio" description="Max 200 caratteri">
      <textarea
        rows={3}
        style={{ ...inputStyle, resize: 'vertical' }}
        placeholder="Racconta chi sei…"
      />
    </FormField>
  </div>
)

export const CustomId = () => (
  <div style={{ width: 320 }}>
    <FormField id="custom-field" label="Con ID custom">
      <input type="text" style={inputStyle} />
    </FormField>
  </div>
)
