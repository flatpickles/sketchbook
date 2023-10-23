import { type ParamConfig, ParamType, ParamConfigDefaults } from '../ParamConfig';

export interface BooleanParamConfig extends ParamConfig {
    default: boolean | undefined;
}

export const BooleanParamConfigDefaults: BooleanParamConfig = {
    ...ParamConfigDefaults,
    type: ParamType.Boolean,
    default: undefined
} as const;

export function isBooleanParamConfig(param: ParamConfig): param is BooleanParamConfig {
    return param.type === ParamType.Boolean;
}
