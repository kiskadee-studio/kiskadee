import { describe, expect, it } from 'vitest';
import {
  ERROR_INVALID_NUMERIC_KEY_FORMAT,
  ERROR_REF_REQUIRE_STATE_NUMERIC,
  transformBorderRadiusKeyToCss
} from './transformBorderRadiusKeyToCss';

const className = 'abc';

describe('transformBorderRadiusKeyToCss', () => {
  // -----------------------------------------------------------------------------------------------
  // responsive (++ styleKeys)
  // -----------------------------------------------------------------------------------------------
  describe('responsive (++ styleKeys)', () => {
    describe('Success operation', () => {
      describe('base without state (no breakpoint)', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius++s:md:1__18';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc { border-radius: 18px }');
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius++s:md:1__18';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc { border-radius: 18px }');
        });
      });

      describe('base with breakpoint', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius++s:md:1::bp:lg:2__18';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('@media (min-width: 1312px) { .abc { border-radius: 18px } }');
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius++s:md:1::bp:lg:2__18';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('@media (min-width: 1312px) { .abc { border-radius: 18px } }');
        });
      });

      describe('another size token (s:sm:1)', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius++s:sm:1__12';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc { border-radius: 12px }');
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius++s:sm:1__12';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc { border-radius: 12px }');
        });
      });

      describe('inline -- :hover with size (no breakpoint)', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius--hover++s:md:1__22';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc:hover { border-radius: 22px }');
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius--hover++s:md:1__22';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc:hover, .abc.-h.-a { border-radius: 22px }');
        });
      });

      describe('inline -- selected:hover with size (no breakpoint)', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius--selected:hover++s:md:1__6';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          // TODO: deveria ter o "-a"?!
          expect(out).toEqual('.abc:hover.-s { border-radius: 6px }');
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius--selected:hover++s:md:1__6';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          // TODO: deveria ter o "-a"?!
          expect(out).toEqual('.abc:hover.-s, .abc.-s.-h.-a { border-radius: 6px }');
        });
      });

      describe('inline -- selected:hover with size+breakpoint', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius--selected:hover++s:lg:1::bp:lg:2__4';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual(
            '@media (min-width: 1312px) { .abc:hover.-s { border-radius: 4px } }'
          );
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius--selected:hover++s:lg:1::bp:lg:2__4';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual(
            '@media (min-width: 1312px) { .abc:hover.-s, .abc.-s.-h.-a { border-radius: 4px } }'
          );
        });
      });

      describe('inline -- focus with size+breakpoint', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius--focus++s:lg:1::bp:md:3__18';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('@media (min-width: 1024px) { .abc:focus { border-radius: 18px } }');
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius--focus++s:lg:1::bp:md:3__18';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual(
            '@media (min-width: 1024px) { .abc:focus, .abc.-f.-a { border-radius: 18px } }'
          );
        });
      });

      describe('inline -- pressed with size (no breakpoint)', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius--pressed++s:sm:1__14';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc:active { border-radius: 14px }');
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius--pressed++s:sm:1__14';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc:active, .abc.-p.-a { border-radius: 14px }');
        });
      });
    });

    describe('Error handling', () => {
      it('should throw on invalid numeric value for responsive key', () => {
        const fn = (): string =>
          transformBorderRadiusKeyToCss('borderRadius++s:md:1__not-a-number', className);
        expect(fn).toThrowError(ERROR_INVALID_NUMERIC_KEY_FORMAT);
      });

      it('should throw on invalid breakpoint token', () => {
        const fn = (): string =>
          transformBorderRadiusKeyToCss('borderRadius++s:md:1::bp:oops__10', className);
        expect(fn).toThrow();
      });
    });
  });

  // -----------------------------------------------------------------------------------------------
  // inline (-- styleKeys)
  // -----------------------------------------------------------------------------------------------
  describe('inline (-- styleKeys)', () => {
    describe('Success operation', () => {
      describe('base (rest is implicit)', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius__20';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc { border-radius: 20px }');
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius__20';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc { border-radius: 20px }');
        });
      });

      describe('hover', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius--hover__24';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc:hover { border-radius: 24px }');
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius--hover__24';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc:hover, .abc.-h.-a { border-radius: 24px }');
        });
      });

      describe('selected:hover', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius--selected:hover__12';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc:hover.-s { border-radius: 12px }');
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius--selected:hover__12';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc:hover.-s, .abc.-s.-h.-a { border-radius: 12px }');
        });
      });

      describe('disabled (forced branch always present)', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius--disabled__10';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc.-d.-a { border-radius: 10px }');
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius--disabled__10';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.abc.-d.-a { border-radius: 10px }');
        });
      });
    });

    describe('Error handling', () => {
      it('should throw if the numeric format is invalid', () => {
        const fn = (): string =>
          transformBorderRadiusKeyToCss('borderRadius--hover__not-a-number', className);
        expect(fn).toThrowError(ERROR_INVALID_NUMERIC_KEY_FORMAT);
      });
    });
  });

  // -----------------------------------------------------------------------------------------------
  // reference (== styleKeys)
  // -----------------------------------------------------------------------------------------------
  describe('reference (== styleKeys)', () => {
    describe('Success operation', () => {
      describe('==hover', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius==hover__12';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.-a:hover .abc { border-radius: 12px }');
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius==hover__12';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.-a:hover .abc, .-a.-h .abc { border-radius: 12px }');
        });
      });

      describe('==focus', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius==focus__6';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.-a:focus .abc { border-radius: 6px }');
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius==focus__6';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.-a:focus .abc, .-a.-f .abc { border-radius: 6px }');
        });
      });

      describe('==selected:hover', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius==selected:hover__8';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.-a:hover.-s .abc { border-radius: 8px }');
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius==selected:hover__8';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual(
            '.-a:hover.-s .abc, .-a.-s.-h \.abc { border-radius: 8px }'.replace(' \\.', ' .')
          );
        });
      });

      describe('==disabled (forced branch always present)', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius==disabled__14';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.-a.-d \.abc { border-radius: 14px }'.replace(' \\.', ' .'));
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius==disabled__14';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.-a.-d .abc { border-radius: 14px }');
        });
      });

      describe('responsive ==hover (no breakpoint)', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius==hover++s:md:1__14';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.-a:hover \.abc { border-radius: 14px }'.replace(' \\.', ' .'));
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius==hover++s:md:1__14';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual('.-a:hover .abc, .-a.-h .abc { border-radius: 14px }');
        });
      });

      describe('responsive ==hover with breakpoint', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius==hover++s:md:1::bp:lg:2__16';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual(
            '@media (min-width: 1312px) { .-a:hover .abc { border-radius: 16px } }'
          );
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius==hover++s:md:1::bp:lg:2__16';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual(
            '@media (min-width: 1312px) { .-a:hover .abc, .-a.-h \.abc { border-radius: 16px } }'.replace(
              ' \\.',
              ' .'
            )
          );
        });
      });

      describe('responsive ==focus with breakpoint', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius==focus++s:lg:1::bp:md:2__10';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual(
            '@media (min-width: 768px) { .-a:focus .abc { border-radius: 10px } }'
          );
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius==focus++s:lg:1::bp:md:2__10';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual(
            '@media (min-width: 768px) { .-a:focus .abc, .-a.-f .abc { border-radius: 10px } }'
          );
        });
      });

      describe('responsive ==selected:focus with breakpoint', () => {
        it('forceState=false', () => {
          const force = false as const;
          const key = 'borderRadius==selected:focus++s:sm:1::bp:md:2__8';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual(
            '@media (min-width: 768px) { .-a:focus.-s .abc { border-radius: 8px } }'
          );
        });
        it('forceState=true', () => {
          const force = true as const;
          const key = 'borderRadius==selected:focus++s:sm:1::bp:md:2__8';
          const out = transformBorderRadiusKeyToCss(key, className, force);
          expect(out).toEqual(
            '@media (min-width: 768px) { .-a:focus.-s .abc, .-a.-s.-f .abc { border-radius: 8px } }'
          );
        });
      });
    });

    describe('Error handling', () => {
      it('should throw if "==" is used without a state', () => {
        const fn = (): string => transformBorderRadiusKeyToCss('borderRadius==__10', className);
        expect(fn).toThrowError(ERROR_REF_REQUIRE_STATE_NUMERIC);
      });

      it('should throw when using an unsupported state token', () => {
        const fn = (): string =>
          transformBorderRadiusKeyToCss('borderRadius==visited__10', className);
        expect(fn).toThrowError(ERROR_REF_REQUIRE_STATE_NUMERIC);
      });
    });
  });
});
