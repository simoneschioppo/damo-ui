import { AspectRatio } from './aspect-ratio'

const box = {
  background: 'linear-gradient(135deg, var(--plum-500), var(--gold-500))',
  border: '2px solid var(--border-memphis)',
  display: 'grid',
  placeItems: 'center',
  color: 'var(--paper-50)',
  fontFamily: 'var(--font-mono)',
  width: '100%',
  height: '100%',
}

export const Sixteen_Nine = () => (
  <div style={{ width: 400 }}>
    <AspectRatio ratio={16 / 9}>
      <div style={box}>16:9</div>
    </AspectRatio>
  </div>
)
Sixteen_Nine.storyName = '16:9'

export const One_One = () => (
  <div style={{ width: 200 }}>
    <AspectRatio ratio={1}>
      <div style={box}>1:1</div>
    </AspectRatio>
  </div>
)
One_One.storyName = '1:1'

export const Four_Three = () => (
  <div style={{ width: 300 }}>
    <AspectRatio ratio={4 / 3}>
      <div style={box}>4:3</div>
    </AspectRatio>
  </div>
)
Four_Three.storyName = '4:3'

export const Twenty_One_Nine = () => (
  <div style={{ width: 500 }}>
    <AspectRatio ratio={21 / 9}>
      <div style={box}>21:9</div>
    </AspectRatio>
  </div>
)
Twenty_One_Nine.storyName = '21:9 (ultrawide)'
