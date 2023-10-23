import { type ParamConfig, ParamType, ParamConfigDefaults } from '../ParamConfig';

export enum StringParamStyle {
    SingleLine = 'single',
    MultiLine = 'multi',
    Color = 'color'
}

export interface StringParamConfig extends ParamConfig {
    style: StringParamStyle;
    default: string | undefined;
    options: string[] | Record<string, string> | undefined;
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
