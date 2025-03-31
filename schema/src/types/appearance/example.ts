import type { Appearance } from './appearance.types';

const buttonAppearance: Appearance = {
  textItalic: false,
  textWeight: 'bold',
  textDecoration: 'none',
  // textTransform: 'uppercase',
  textAlign: 'center',
  cursor: 'pointer',
  borderStyle: 'solid',
  shadowColor: { rest: [0, 0, 0, 0.5] },
  shadowBlur: { rest: 5, hover: 10 },
  shadowY: { rest: 2, hover: 4 },
  shadowX: { rest: 2, hover: 4 }
};

console.log(buttonAppearance);
