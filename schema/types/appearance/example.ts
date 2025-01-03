import type { Appearance } from './appearance.types';

const buttonAppearance: Appearance = {
  fontItalic: false,
  fontWeight: 'bold',
  textDecoration: 'none',
  textTransform: 'uppercase',
  textAlign: 'center',
  cursor: 'pointer',
  borderStyle: 'solid',
  shadowColor: [0, 0, 0, 0.5],
  shadowBlur: { rest: 5, hover: 10 },
  shadowY: { rest: 2, hover: 4 },
  shadowX: { rest: 2, hover: 4 }
};

console.log(buttonAppearance);
