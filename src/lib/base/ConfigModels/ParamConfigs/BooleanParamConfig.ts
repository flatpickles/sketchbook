import { type ParamConfig, ParamType, ParamConfigDefaults } from '../ParamConfig';

export interface BooleanParamConfig extends ParamConfig {
    default?: boolean;
    enables?: string[]; // todo - implement
    disables?: string[]; // todo - implement
}

export const BooleanParamConfigDefaults: BooleanParamConfig = {
    ...ParamConfigDefaults,
    type: ParamType.Boolean,
    default: undefined,
    enables: undefined,
    disables: undefined
} as const;

export function isBooleanParamConfig(param: ParamConfig): param is BooleanParamConfig {
    return param.type === ParamType.Boolean;
}
