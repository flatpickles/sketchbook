import { type ParamConfig, ParamType, ParamConfigDefaults } from './ParamConfig';

// Function params offer no additional configuration options
export type FunctionParamConfig = ParamConfig;

export const FunctionParamConfigDefaults: ParamConfig = {
    ...ParamConfigDefaults,
    type: ParamType.Function
} as const;

export function isFunctionParamConfig(param: ParamConfig): param is FunctionParamConfig {
    return param.type === ParamType.Function;
}
