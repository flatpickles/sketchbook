import { type ParamConfig, ParamType, ParamConfigDefaults } from './ParamConfig';

export enum StringParamStyle {
    SingleLine = 'single',
    MultiLine = 'multi',
    Color = 'color',
    Options = 'options'
}

export interface StringParamConfig extends ParamConfig {
    style: StringParamStyle;
    options?: string[];
}

export const StringParamConfigDefaults: StringParamConfig = {
    ...ParamConfigDefaults,
    type: ParamType.String,
    style: StringParamStyle.SingleLine
} as const;

export function isStringParamConfig(param: ParamConfig): param is StringParamConfig {
    return param.type === ParamType.String;
}
