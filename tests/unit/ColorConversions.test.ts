import { describe, it, expect } from 'vitest';
import ColorConversions from '$lib/base/Util/ColorConversions';

describe('ColorConversions', () => {
    it('converts hex to rgb', () => {
        expect(ColorConversions.hexToRgb('#ff00ff')).toEqual([255, 0, 255]);
        expect(ColorConversions.hexToRgb('#00ff00')).toEqual([0, 255, 0]);
        expect(ColorConversions.hexToRgb('#0000ff')).toEqual([0, 0, 255]);
        expect(ColorConversions.hexToRgb('#ffffff')).toEqual([255, 255, 255]);
        expect(ColorConversions.hexToRgb('#000000')).toEqual([0, 0, 0]);
    });

    it('converts hex to rgb unit', () => {
        expect(ColorConversions.hexToRgb('#ff00ff', true)).toEqual([1, 0, 1]);
        expect(ColorConversions.hexToRgb('#00ff00', true)).toEqual([0, 1, 0]);
        expect(ColorConversions.hexToRgb('#0000ff', true)).toEqual([0, 0, 1]);
        expect(ColorConversions.hexToRgb('#ffffff', true)).toEqual([1, 1, 1]);
        expect(ColorConversions.hexToRgb('#000000', true)).toEqual([0, 0, 0]);
    });

    it('converts rgb to hex', () => {
        expect(ColorConversions.rgbToHex([255, 0, 255])).toBe('#ff00ff');
        expect(ColorConversions.rgbToHex([0, 255, 0])).toBe('#00ff00');
        expect(ColorConversions.rgbToHex([0, 0, 255])).toBe('#0000ff');
        expect(ColorConversions.rgbToHex([255, 255, 255])).toBe('#ffffff');
        expect(ColorConversions.rgbToHex([0, 0, 0])).toBe('#000000');
    });

    it('throws errors for invalid hex values', () => {
        expect(() => ColorConversions.hexToRgb('#ff00f')).toThrow();
        expect(() => ColorConversions.hexToRgb('#ff00ff00')).toThrow();
        expect(() => ColorConversions.hexToRgb('#ff00fg')).toThrow();
        expect(() => ColorConversions.hexToRgb('#ff00ff00')).toThrow();
        expect(() => ColorConversions.hexToRgb('#ff00ff00')).toThrow();
    });

    it('throws errors for invalid rgb values', () => {
        expect(() => ColorConversions.rgbToHex([-1, 0, 0])).toThrow();
        expect(() => ColorConversions.rgbToHex([0, 256, 0])).toThrow();
        expect(() => ColorConversions.rgbToHex([0, 0, -1])).toThrow();
        expect(() => ColorConversions.rgbToHex([0, 0, 256])).toThrow();
        expect(() => ColorConversions.rgbToHex([0, 0])).toThrow();
        expect(() => ColorConversions.rgbToHex([0, 0, 0, 0])).toThrow();
        expect(() => ColorConversions.rgbToHex([0, 0, 0, 0, 0])).toThrow();
        expect(() => ColorConversions.rgbToHex([12.5, 1.02, 5])).toThrow();
    });
});
