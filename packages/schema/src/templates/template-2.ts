import { breakpoints } from '../breakpoints';
import type { Schema } from '../schema';

export const schema: Schema = {
  breakpoints,
  components: {
    button: {
      elements: {
        e1: {
          decorations: {
            borderStyle: 'none'
          },
          palettes: {
            p1: {
              boxColor: {
                primary: {
                  rest: [219, 100, 50, 1]
                }
              }
            }
          }
        },
        e2: {
          palettes: {
            p1: {
              textColor: {
                primary: {
                  rest: [0, 0, 100, 1]
                }
              }
            }
          }
        }
      }
    }
  }
};
