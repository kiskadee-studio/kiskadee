import type { BorderRadiusEffectSchema } from '@kiskadee/schema';
import { describe, expect, it } from 'vitest';
import { convertElementBorderRadiusToStyleKeys } from './convertElementBorderRadiusToStyleKeys';

describe('convertElementBorderRadiusToStyleKeys', () => {
  it('generates style keys for basic numeric states (rest, hover, pressed, focus, disabled, readOnly)', () => {
    const schema: BorderRadiusEffectSchema = {
      rest: 20,
      hover: 24,
      pressed: 16,
      focus: 20,
      disabled: 12,
      readOnly: 18
    };

    const result = convertElementBorderRadiusToStyleKeys(schema);

    expect(result).toEqual({
      rest: ['borderRadius__20'],
      hover: ['borderRadius--hover__24'],
      pressed: ['borderRadius--pressed__16'],
      focus: ['borderRadius--focus__20'],
      disabled: ['borderRadius--disabled__12'],
      readOnly: ['borderRadius--readOnly__18']
    });
  });

  it('generates style keys for selected nested states', () => {
    const schema: BorderRadiusEffectSchema = {
      rest: 20,
      selected: {
        rest: 0,
        hover: 4,
        pressed: 0,
        focus: 0
      }
    };

    const result = convertElementBorderRadiusToStyleKeys(schema);

    expect(result).toEqual({
      rest: ['borderRadius__20'],
      'selected:rest': ['borderRadius--selected:rest__0'],
      'selected:hover': ['borderRadius--selected:hover__4'],
      'selected:pressed': ['borderRadius--selected:pressed__0'],
      'selected:focus': ['borderRadius--selected:focus__0']
    });
  });

  it('generates responsive ++size keys for non-selected values', () => {
    const schema: BorderRadiusEffectSchema = {
      rest: {
        's:sm:1': 20,
        's:md:1': 18
      }
    };

    const result = convertElementBorderRadiusToStyleKeys(schema);
    expect(result).toEqual({
      rest: ['borderRadius++s:sm:1__20', 'borderRadius++s:md:1__18']
    });
  });

  it('generates non-responsive key (no ++s:all) for values using s:all', () => {
    const schema: BorderRadiusEffectSchema = {
      rest: {
        's:all': 12
      }
    };

    const result = convertElementBorderRadiusToStyleKeys(schema);
    expect(result).toEqual({
      rest: ['borderRadius__12']
    });
  });

  it('generates responsive ++size keys for selected sub-map values with explicit state in key, stored under selected:hover', () => {
    const schema: BorderRadiusEffectSchema = {
      selected: {
        hover: {
          's:lg:1': 4
        }
      }
    };

    const result = convertElementBorderRadiusToStyleKeys(schema);

    expect(result).toEqual({
      'selected:hover': ['borderRadius--selected:hover++s:lg:1__4']
    });
  });
});
