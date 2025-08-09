import { describe, it, expect } from 'vitest';
import { buildStyleKey, type BuildStyleKeyParams } from './buildStyeKey';

describe('buildStyleKey', () => {
  describe('decoration keys (no suffix)', () => {
    it('serializes a number value', () => {
      const opts: BuildStyleKeyParams = { propertyName: 'width', value: 10 };
      expect(buildStyleKey(opts)).toBe('width__10');
    });

    it('serializes a string value', () => {
      const opts: BuildStyleKeyParams = { propertyName: 'label', value: 'hello' };
      expect(buildStyleKey(opts)).toBe('label__hello');
    });

    it('serializes a boolean value', () => {
      const opts: BuildStyleKeyParams = { propertyName: 'visible', value: true };
      expect(buildStyleKey(opts)).toBe('visible__true');
    });

    it('serializes an array value', () => {
      const arr = [1, 2, 3];
      const opts: BuildStyleKeyParams = { propertyName: 'list', value: arr };
      expect(buildStyleKey(opts)).toBe('list__[1,2,3]');
    });
  });

  describe('shadow keys (interactionState only)', () => {
    it('appends --rest suffix for rest state', () => {
      const opts: BuildStyleKeyParams = {
        propertyName: 'shadow',
        interactionState: 'rest',
        value: [10, 5, 3]
      };
      expect(buildStyleKey(opts)).toBe('shadow--rest__[10,5,3]');
    });

    it('appends --hover suffix for hover state', () => {
      const opts: BuildStyleKeyParams = {
        propertyName: 'shadow',
        interactionState: 'hover',
        value: [0, 0, 0]
      };
      expect(buildStyleKey(opts)).toBe('shadow--hover__[0,0,0]');
    });
  });

  describe('color keys (interactionState + isRef)', () => {
    it('rest + isRef=true does not change separator', () => {
      const opts: BuildStyleKeyParams = {
        propertyName: 'color',
        interactionState: 'rest',
        isRef: true,
        value: '#ffffff'
      };
      expect(buildStyleKey(opts)).toBe('color--rest__#ffffff');
    });

    it('hover + isRef=true uses == separator', () => {
      const opts: BuildStyleKeyParams = {
        propertyName: 'color',
        interactionState: 'hover',
        isRef: true,
        value: '#fff'
      };
      expect(buildStyleKey(opts)).toBe('color==hover__#fff');
    });

    it('hover + isRef=false does not use == separator', () => {
      const opts: BuildStyleKeyParams = {
        propertyName: 'color',
        interactionState: 'hover',
        isRef: false,
        value: '#000'
      };
      expect(buildStyleKey(opts)).toBe('color--hover__#000');
    });

    // Guard against missing interactionState when isRef=true
    it('no interactionState + isRef=true falls back to base separator', () => {
      const opts: BuildStyleKeyParams = {
        propertyName: 'color',
        value: '#abc',
        isRef: true
        // intentionally no interactionState
      };
      expect(buildStyleKey(opts)).toBe('color__#abc');
    });
  });

  describe('scale keys (size + optional breakpoint)', () => {
    it('size only produces ++{size} separator', () => {
      const opts: BuildStyleKeyParams = {
        propertyName: 'fontSize',
        size: 's:lg:1',
        value: 16
      };
      expect(buildStyleKey(opts)).toBe('fontSize++s:lg:1__16');
    });

    it('size + breakpoint produces ++{size}::{breakpoint}', () => {
      const opts: BuildStyleKeyParams = {
        propertyName: 'fontSize',
        size: 's:lg:1',
        breakpoint: 'bp:sm:1',
        value: 24
      };
      expect(buildStyleKey(opts)).toBe('fontSize++s:lg:1::bp:sm:1__24');
    });
  });
});
