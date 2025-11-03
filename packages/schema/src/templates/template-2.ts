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
            p1: {}
          }
        }
      }
    }
  }
};
