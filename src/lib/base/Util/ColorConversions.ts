export default class ColorConversions {
    public static hexToRgb(hex: string): number[] {
        const hexComponents = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!hexComponents) throw new Error('rgbToHex: invalid hex string');
        if (hexComponents.length !== 4)
            throw new Error('rgbToHex: hex value must be in the format #rrggbb');
        return [
            parseInt(hexComponents[1], 16),
            parseInt(hexComponents[2], 16),
            parseInt(hexComponents[3], 16)
        ];
    }

    public static rgbToHex(rgb: number[]): string {
        if (rgb.length !== 3) throw new Error('rgbToHex: rgb array must have 3 components');
        rgb.forEach((component) => {
            if (component < 0 || component > 255)
                throw new Error('rgbToHex: rgb components must be between 0 and 255');
            if (!Number.isInteger(component))
                throw new Error('rgbToHex: rgb components must be integers');
        });
        const rHex = ColorConversions.componentToHex(rgb[0]);
        const gHex = ColorConversions.componentToHex(rgb[1]);
        const bHex = ColorConversions.componentToHex(rgb[2]);
        return `#${rHex}${gHex}${bHex}`;
    }

    public static componentToHex(c: number): string {
        const hex = c.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    }
}
