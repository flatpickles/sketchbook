import { type ParamConfig, ParamType, ParamConfigDefaults } from '../ParamConfig';

export interface FunctionParamConfig extends ParamConfig {
    buttonText: string;
}

export const FunctionParamConfigDefaults: FunctionParamConfig = {
    ...ParamConfigDefaults,
    type: ParamType.Function,
    buttonText: 'Run'
} as const;

export function isFunctionParamConfig(param: ParamConfig): param is FunctionParamConfig {
    return param.type === ParamType.Function;
}
