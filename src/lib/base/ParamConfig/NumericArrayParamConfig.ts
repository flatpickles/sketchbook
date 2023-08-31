import { type ParamConfig, ParamConfigDefaults, ParamType } from './ParamConfig';
import { NumberParamConfigDefaults } from './NumberParamConfig';

export enum NumericArrayParamStyle {
    Combo = 'combo',
    CompactField = 'compactField',
    CompactSlider = 'compactSlider',
    Slider = 'slider',
    Field = 'field',
    Color = 'color',
    UnitColor = 'unitColor'
}

export interface NumericArrayParamConfig extends ParamConfig {
    min: number;
    max: number;
    step: number;
    style: NumericArrayParamStyle;
    options?: number[][] | Record<string, number[]>;
}

export const NumericArrayParamConfigDefaults: NumericArrayParamConfig = {
    ...ParamConfigDefaults,
    type: ParamType.NumericArray,
    min: NumberParamConfigDefaults.min,
    max: NumberParamConfigDefaults.max,
    step: NumberParamConfigDefaults.step,
    style: NumericArrayParamStyle.Combo,
    options: undefined
} as const;

export function isNumericArrayParamConfig(param: ParamConfig): param is NumericArrayParamConfig {
    return param.type === ParamType.NumericArray;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNumericArray(value: any): value is number[] {
    if (!Array.isArray(value)) return false;
    for (const member of value) {
        if (typeof member !== 'number') return false;
    }
    return true;
}
