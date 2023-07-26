import { type ParamConfig, ParamConfigDefaults, ParamType } from './ParamConfig';

enum NumberParamStyle {
    Slider = 'slider',
    Input = 'input'
}

export interface NumberParamConfig extends ParamConfig {
    min: number;
    max: number;
    step: number;
    liveUpdates: boolean;
    style: NumberParamStyle;
    options?: string[];
}

export const NumberParamConfigDefaults: NumberParamConfig = {
    ...ParamConfigDefaults,
    type: ParamType.Number,
    min: 0,
    max: 1,
    step: 0.01,
    liveUpdates: true,
    style: NumberParamStyle.Slider,
    options: undefined
} as const;

export function isNumberParamConfig(param: ParamConfig): param is NumberParamConfig {
    return param.type === ParamType.Number;
}
