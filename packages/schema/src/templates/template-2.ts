import { breakpoints } from '../breakpoints';
import type { Schema } from '../schema';

export const schema: Schema = {
  name: 'template-2',
  version: [0, 0, 1],
  author: 'Rodrigo Mello',
  breakpoints,
  components: {
    button: {
      elements: {
        e1: {
          palettes: {
            p1: {
              boxColor: {
                primary: {
                  rest: [210, 98.33, 47.06, 1],
                  selected: {
                    rest: [210, 98.33, 47.06, 1],
                    hover: [256.43, 34.43, 47.84, 0.5]
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
