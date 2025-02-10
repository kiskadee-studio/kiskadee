import type { Palettes } from './palettes.types';

const palettes: Palettes = {
  bgColor: {
    primary: {
      rest: [
        90,
        [
          [45, 100, 50, 1, 0],
          [180, 100, 50, 1, 100]
        ]
      ]
    }
  },
  borderColor: {
    primary: {
      rest: [45, 0, 0, 0.02]
    },
    danger: {
      rest: [0, 0, 0, 0.02],
      hover: [0, 0, 0, 0.02]
    }
  },
  textColor: {
    primary: {
      rest: [120, 50, 50, 1],
      hover: {
        ref: [240, 50, 50, 0.5]
      }
    },
    secondary: {
      rest: [240, 50, 50, 0.5]
    }
  }
};
