import { type ParamConfig, ParamType, ParamConfigDefaults } from '../ParamConfig';

export enum StringParamStyle {
    SingleLine = 'single',
    MultiLine = 'multi',
    Color = 'color'
}

export interface StringParamConfig extends ParamConfig {
    style: StringParamStyle;
    default?: string;
    options?: string[] | Record<string, string>;
}

export const StringParamConfigDefaults: StringParamConfig = {
    ...ParamConfigDefaults,
    type: ParamType.String,
    style: StringParamStyle.SingleLine,
    default: undefined,
    options: undefined
} as const;

export function isStringParamConfig(param: ParamConfig): param is StringParamConfig {
    return param.type === ParamType.String;
}
