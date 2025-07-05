import type { EffectSchema } from './effect.types';

const buttonEffects: EffectSchema = {
  shadow: {
    color: { rest: [0, 0, 0, 0.5] },
    blur: { rest: 5, hover: 10 },
    y: { rest: 2, hover: 4 },
    x: { rest: 2, hover: 4 }
  }
};

console.log(buttonEffects);
