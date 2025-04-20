import { describe, expect, it } from 'vitest';
import { convertHslaToHex } from '../convertHslaToHex';

describe('convertHslaToHex', () => {
  it('should convert pure red with full opacity to 6-digit hex', () => {
    // Pure red: h=0, s=100, l=50, alpha=1
    const hsla: [number, number, number, number] = [0, 100, 50, 1];
    expect(convertHslaToHex(hsla)).toBe('#ff0000');
  });

  it('should convert pure green with full opacity to 6-digit hex', () => {
    // Pure green: h=120, s=100, l=50, alpha=1
    const hsla: [number, number, number, number] = [120, 100, 50, 1];
    expect(convertHslaToHex(hsla)).toBe('#00ff00');
  });

  it('should convert pure blue with full opacity to 6-digit hex', () => {
    // Pure blue: h=240, s=100, l=50, alpha=1
    const hsla: [number, number, number, number] = [240, 100, 50, 1];
    expect(convertHslaToHex(hsla)).toBe('#0000ff');
  });

  it('should convert an orange color to valid hex with full opacity', () => {
    // Orange: h=30, s=100, l=50, alpha=1
    // Expected: "#ff8000" (red=255, green=128, blue=0)
    const hsla: [number, number, number, number] = [30, 100, 50, 1];
    expect(convertHslaToHex(hsla)).toBe('#ff8000');
  });

  it('should include alpha in hex when alpha is not 1 (8-digit hex)', () => {
    // Pure red with half transparency: h=0, s=100, l=50, alpha=0.5
    // Expected alpha hex: Math.round(0.5*255)=128 -> "80"
    const hsla: [number, number, number, number] = [0, 100, 50, 0.5];
    expect(convertHslaToHex(hsla)).toBe('#ff000080');
  });

  it('should return a 6-digit hex if alpha is null or undefined', () => {
    // Using undefined for alpha, should be treated as full opacity.
    const hsla: [number, number, number, number] = [30, 100, 50, undefined as unknown as number];
    expect(convertHslaToHex(hsla)).toBe('#ff8000');
  });

  it('should correctly handle hues near the upper boundary', () => {
    // For h=359, s=100, l=50, alpha=0.3
    // Calculation details:
    // h=359 falls into the h>=300 && h<360 branch:
    // c = (1 - Math.abs(2*0.5 -1)) * 1 = 1
    // x = 1 * (1 - Math.abs(((359/60)%2)-1)) -> ((359/60)%2) ≈ 1.9833, so x ≈ 1*(1 - 0.9833)=0.0167
    // m = 0.5 - 0.5 = 0
    // r = c = 1, g = 0, b = x ≈ 0.0167
    // rHex = round(1*255)=255 -> "ff"
    // gHex = round(0*255)=0 -> "00"
    // bHex = round(0.0167*255) ≈ 4 -> "04"
    // Alpha: round(0.3*255)=77 -> "4d"
    const hsla: [number, number, number, number] = [359, 100, 50, 0.3];
    expect(convertHslaToHex(hsla)).toBe('#ff00044d');
  });
});
